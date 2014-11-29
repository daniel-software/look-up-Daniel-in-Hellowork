cd "%~dp0..\"

IF /%1==/ (set CASPERJS=casperjs.exe) else set CASPERJS=%1
IF /%2==/ (set OUT_FILE=results.xml) else set OUT_FILE=%2

%CASPERJS% test CanSearchForDaniel.js --xunit=%OUT_FILE%
