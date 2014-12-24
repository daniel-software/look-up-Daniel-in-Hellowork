rem CasperJSが、空白含むファイルパス名を実行できないから 8.3 形式にする
SET BASE_DIR=%~dps0..

IF /%1==/ (set CASPERJS=casperjs.exe) else set CASPERJS=%1
IF /%2==/ (set OUT_FILE=results.xml) else set OUT_FILE=%2

%CASPERJS% test %BASE_DIR%\look-up-Daniel-in-Hellowork.js --xunit=%OUT_FILE% --ignore-ssl-errors=true
