Сборка приложения на Windows:
    python -m PyInstaller --onefile --add-data "assets;assets" --add-data "index.html;." --add-data "vite.svg;." server.py

Сборка приложеня на Mac OS:
1) Установка PyInstaller:
    python3 -m pip install pyinstaller
    При ошибке доступа прав python3 -m pip install --user pyinstaller

2)  pyinstaller --onefile --add-data "assets:assets" --add-data "index.html:." --add-data "vite.svg:." server.py