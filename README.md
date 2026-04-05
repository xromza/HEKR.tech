# HEKR.tech | Full-Stack E-Commerce Platform

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**HEKR.tech** — это высокотехнологичная платформа для дистрибуции товаров как для бизнеса, так и для продаж физическим лицам. Система спроектирована с учетом требований B2B и B2C сегментов, поддерживая гибкое ценообразование и сложную складскую логистику.

---

## 🏗 Архитектурные особенности

### 🛡 Security & Auth (JWT + HttpOnly)
Реализована отказоустойчивая система аутентификации, исключающая XSS-уязвимости:
* **Stateless Access:** Короткоживущие Access-токены для авторизации запросов.
* **Database-backed Refresh:** Длинноживущие токены хранятся в PostgreSQL для управления сессиями.
* **HttpOnly Cookies:** Refresh-токены защищены от доступа через JS на стороне клиента.
* **Axios Interceptors:** Автоматическое обновление сессии при истечении Access-токена (Silent Refresh).

### 📊 Database Design (Table-per-Type)
Для работы с разными типами контрагентов применена стратегия наследования таблиц:
* **Users Core:** Базовая таблица с аутентификационными данными и ролями (`CLIENT`, `MANAGER`, `ADMIN`).
* **Individual Details:** Расширенные данные физических лиц (паспортные данные, контакты).
* **Legal Details:** Юридические данные организаций (ИНН, КПП, ОГРН).
* **Logic-Driven Pricing:** Автоматический расчет цен (розница/опт) на основе `wholesale_threshold` для каждой позиции.

---

## 🛠 Технологический стек

### Backend
* **Core:** Spring Boot 4, Spring Security, Spring Data JPA.
* **Database:** PostgreSQL 18 (нормализованная схема с историей статусов заказов).
* **API:** RESTful API с полной спецификацией в Markdown и Swagger OpenAPI.

### Frontend
* **Framework:** Next.js / React.
* **State Management:** Axios Interceptors для обработки JWT жизненного цикла.

### DevOps & Environment
* **Infrastructure:** Nginx (Reverse Proxy), Docker Compose.

---

## 📖 Документация API

Полный перечень эндпоинтов, включая управление складом и администрирование пользователей, доступен в [Спецификации API](backend/API.md).

### Основные модули:
1. **Catalog:** Полнотекстовый поиск и фильтрация товаров.
2. **Checkout:** Оформление заказов с проверкой остатков на конкретных складах.
3. **Admin Panel:** Управление ролями, инвентаризация и трекинг истории заказов.

---

## 🚀 Быстрый старт

1. Соберите проект: `./mvnw clean package`
2. Запустите инфраструктуру: `docker-compose up -d`
3. Backend будет доступен на порту `8080`, Frontend на `3000`.

---

**Команда разработчиков HEKR TEAM**
| Наименование должности | Сотрудник |
| :--- | :--- |
| **Тимлид** | Петров К. Д. ([xromza](https://github.com/xromza/))|
| **Аналитик** | Ташу М. Ю. ([FlameGame](https://github.com/FlameGame-maker))|
| **Аналитик** | Маслак Е. А. ([Mas-Eg](https://github.com/Mas-Eg))|
| **Лид разработки** | Петров К. Д. ([xromza](https://github.com/xromza/))|
| **Разработчик БД** | Петров К. Д. ([xromza](https://github.com/xromza/)) |
| **Дизайнер** | Капитонов П. О. ([pavalapi](https://github.com/Pavel-Kapitonov)) |
| **Frontend-разработчик** | Капитонов П. О. ([pavalapi](https://github.com/Pavel-Kapitonov)) |
| **Frontend-разработчик** | Приймак А. Д.([Priymalex](https://github.com/Priymalex)) |
| **Тестировщик** | Капитонов П. О. ([pavalapi](https://github.com/Pavel-Kapitonov)), Приймак А. Д. |
| **Backend-разработчик** | Овсепян Н. А. ([kklaha](https://github.com/kklaha)) |
| **DevOps** | Петров К. Д. ([xromza](https://github.com/xromza/)) |
| **Full stack-разработчик** | Петров К. Д. ([xromza](https://github.com/xromza/)) |