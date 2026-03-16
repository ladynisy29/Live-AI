$base = "http://localhost:4000"
$ts   = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$pass = 0; $fail = 0

function Check($label, $cond) {
    if ($cond) { Write-Host "  PASS  $label" -ForegroundColor Green; $script:pass++ }
    else       { Write-Host "  FAIL  $label" -ForegroundColor Red;   $script:fail++ }
}

Write-Host ""
Write-Host "[1] REGISTER" -ForegroundColor Cyan
$email = "ct_$ts@test.local"; $pwd = "Test1234!"
$reg = Invoke-RestMethod "$base/api/auth/register" -Method POST -ContentType "application/json" -Body (ConvertTo-Json @{name="ClickTester";email=$email;password=$pwd})
Check "Register returns token"        ($reg.token -ne $null)
Check "Register role = student"       ($reg.user.role -eq "student")
$tok = $reg.token; $uid = $reg.user.id

Write-Host ""
Write-Host "[2] LOGIN" -ForegroundColor Cyan
$login = Invoke-RestMethod "$base/api/auth/login" -Method POST -ContentType "application/json" -Body (ConvertTo-Json @{email=$email;password=$pwd})
Check "Login returns token"           ($login.token -ne $null)
$tok = $login.token
$me = Invoke-RestMethod "$base/api/auth/me" -Headers @{Authorization="Bearer $tok"}
Check "/me returns correct email"     ($me.user.email -eq $email)

Write-Host ""
Write-Host "[3] TUTORIALS" -ForegroundColor Cyan
$boot = Invoke-RestMethod "$base/api/content/bootstrap"
Check "Bootstrap has 12+ tutorials"   ($boot.tutorials.Count -ge 12)
$tut  = $boot.tutorials | Where-Object { $_.id -eq "html-foundations" } | Select-Object -First 1
Check "html-foundations exists"       ($tut -ne $null)
Check "Tutorial has exampleHtml"      ($tut.exampleHtml -ne $null)
Check "Tutorial has exercisePrompt"   ($tut.exercisePrompt -ne $null)

Write-Host ""
Write-Host "[4] PROGRESS" -ForegroundColor Cyan
$prog = Invoke-RestMethod "$base/api/users/$uid/progress" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $tok"} -Body (ConvertTo-Json @{lessonId="html-foundations"})
Check "Mark lesson complete ok"       ($prog.ok -eq $true)
$gp = Invoke-RestMethod "$base/api/users/$uid/progress" -Headers @{Authorization="Bearer $tok"}
Check "Progress contains lesson id"   (@($gp.completedLessons) -contains "html-foundations")

Write-Host ""
Write-Host "[5] SNIPPETS" -ForegroundColor Cyan
$snip = Invoke-RestMethod "$base/api/users/$uid/snippets" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $tok"} -Body (ConvertTo-Json @{name="Test Snippet";html="<h1>Hi</h1>";css="h1{color:purple}";js=""})
$sid = $snip.snippet.id
Check "Save snippet returns id"       ($sid -ne $null)
$snips = Invoke-RestMethod "$base/api/users/$uid/snippets" -Headers @{Authorization="Bearer $tok"}
Check "Snippet appears in list"       (($snips.snippets | Where-Object { $_.id -eq $sid }) -ne $null)
$del = Invoke-RestMethod "$base/api/users/$uid/snippets/$sid" -Method DELETE -Headers @{Authorization="Bearer $tok"}
Check "Delete snippet returns ok"     ($del.ok -eq $true)
$snips2 = Invoke-RestMethod "$base/api/users/$uid/snippets" -Headers @{Authorization="Bearer $tok"}
Check "Snippet gone after delete"     (($snips2.snippets | Where-Object { $_.id -eq $sid }) -eq $null)

Write-Host ""
Write-Host "[6] EXAM" -ForegroundColor Cyan
$exam = Invoke-RestMethod "$base/api/exams/submit" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $tok"} -Body (ConvertTo-Json @{userId=$uid;score=4;total=5})
Check "Exam submit returns result"    ($exam.passed -ne $null)
Check "Exam returns score 4"          ($exam.score -eq 4)
Check "Exam passed at 80pct"          ($exam.passed -eq $true)

Write-Host ""
Write-Host "[7] ADMIN CRUD" -ForegroundColor Cyan
Invoke-RestMethod "$base/api/auth/dev-seed-admin" -Method POST -ContentType "application/json" | Out-Null
$admL = Invoke-RestMethod "$base/api/auth/login" -Method POST -ContentType "application/json" -Body (ConvertTo-Json @{email="admin@learnwithladynisy.local";password="Admin123!"})
Check "Admin login returns token"     ($admL.token -ne $null)
Check "Admin role = admin"            ($admL.user.role -eq "admin")
$admTok = $admL.token
$cid = "ct-$ts"
$cr = Invoke-RestMethod "$base/api/admin/tutorials" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $admTok"} -Body (ConvertTo-Json @{id=$cid;title="Click Test";description="Auto";category="html";level="beginner";lessons=@()})
Check "Admin CREATE returns id"       ($cr.tutorial.id -eq $cid)
$ed = Invoke-RestMethod "$base/api/admin/tutorials/$cid" -Method PUT -ContentType "application/json" -Headers @{Authorization="Bearer $admTok"} -Body (ConvertTo-Json @{title="Click Test (Edited)";description="Updated";category="html";level="intermediate";lessons=@()})
Check "Admin EDIT returns tutorial"   ($ed.tutorial -ne $null)
$boot2 = Invoke-RestMethod "$base/api/content/bootstrap"
$edTut = $boot2.tutorials | Where-Object { $_.id -eq $cid } | Select-Object -First 1
Check "Edit title persisted"          ($edTut.title -eq "Click Test (Edited)")
$dt = Invoke-RestMethod "$base/api/admin/tutorials/$cid" -Method DELETE -Headers @{Authorization="Bearer $admTok"}
Check "Admin DELETE returns ok"       ($dt.ok -eq $true)
$boot3 = Invoke-RestMethod "$base/api/content/bootstrap"
Check "Deleted tut gone from list"    (($boot3.tutorials | Where-Object { $_.id -eq $cid }) -eq $null)

Write-Host ""
Write-Host "[8] LOGOUT" -ForegroundColor Cyan
$out  = Invoke-RestMethod "$base/api/auth/logout" -Method POST -Headers @{Authorization="Bearer $tok"}
Check "Logout returns ok"             ($out.ok -eq $true)
$me2  = Invoke-RestMethod "$base/api/auth/me" -Headers @{Authorization="Bearer $tok"} -ErrorAction SilentlyContinue
Check "Token invalid after logout"    ($me2 -eq $null)

Write-Host ""
$total = $pass + $fail
$col   = if ($fail -eq 0) {"Green"} else {"Yellow"}
Write-Host "==========================================" -ForegroundColor White
Write-Host "  RESULT   pass=$pass   fail=$fail   total=$total" -ForegroundColor $col
Write-Host "==========================================" -ForegroundColor White
