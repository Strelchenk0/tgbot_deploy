            Процес розгортання
1. Пуш до GitHub:

Коли ти пушиш зміни в гілку main, GitHub Actions автоматично запускає пайплайн.
2. Build Docker Image:

3. Пайплайн будує Docker-образ за допомогою Dockerfile і завантажує його в Docker Hub або інший реєстр.
Terraform:

4. Після успішного побудови образу Terraform створює або оновлює інфраструктуру на AWS (EC2 інстанцію).
Ansible:

5. Після створення інфраструктури Ansible підключається до EC2 інстанції та налаштовує середовище (встановлює Docker, тягне образ і запускає контейнер).
Таким чином, ти автоматизуєш весь процес розгортання, від коміту коду до його доставки на сервер.# tgbot_deploy
