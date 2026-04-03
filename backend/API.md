# Спецификация API (v1)

Данный документ описывает эндпоинты для взаимодействия фронтенда с бэкендом на Spring Boot. 

## Базовый URL
`https://hekr.tech/api/v1`

---

## 1. Каталог товаров (Catalog)
Работа с витриной и поиском.

### 1.1. Получить список карточек всех товаров
**Метод:** `GET`  
**Путь:** `/products`  
**Доступ:** Всем  

**Параметры (Query):**
* `page` (int) — номер страницы (с 0)
* `size` (int) — элементов на странице

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Ультразвуковой датчик HC-SR04",
    "price_retail": 250.00,
    "price_wholesome": 180.50
  },
  {
    "id": 2,
    "title": "Плата Arduino Uno R3",
    "price_retail": 1200.00,
    "price_wholesome": 850.00
  }
]
```
### 1.2. Найти товары по имени
**Метод:** `GET`  
**Путь:** `/products/search`  
**Доступ:** Всем  

**Параметры (Query):**
* `page` (int) — номер страницы (с 0)
* `size` (int) — элементов на странице
* `query` (string) — поисковая строка

**Пример запроса**
`GET /products/search?query="датчик"`
**Успешный ответ (200 OK):**
```json
[
    {
        "id": 1,
        "title": "Ультразвуковой датчик HC-SR04",
        "price_retail": 250.00,
        "price_wholesome": 180.50
    }
]
```
### 1.3. Информация о товаре
Получение информации о конкретном товаре<br/>

**Метод:** `GET`  
**Путь:** `/products/{id}`  
**Доступ:** все<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
{
    "id": 1,
    "title": "Ультразвуковой датчик HC-SR04",
    "description": "Описание для Ультразвуковой датчик HC-SR04",
    "weight": 1,
    "size": "20 см",
    "category_id": 1,
    "price_retail": 250.00,
    "wholesale_threshold": 10,
    "stock": [
        {
            "warehouse_id": 1,
            "warehouse_address": "г. Москва ул. Складская д. 3",
            "quantity": 3
        },
                {
            "warehouse_id": 2,
            "warehouse_address": "г. Великие Луки ул. Потайная д. 341/1",
            "quantity": 0
        }
    ]
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
    "error": "Not Found",
    "message": "Товар не найден"
}
```
## 2. Аутентификация (Auth)
Аутентификация и регистрация пользователей
### 2.1 Аутентификация
Вход пользователя по логину и паролю<br/>

**Метод:** `POST`  
**Путь:** `/auth/login`  
**Доступ:** Всем  
**Устанавливает Cookie:** refreshToken  
**Тело запроса (Body):**
```json
{
    "login": "kirill_petrov",
    "password": "orapass"
}
```
**Успешный ответ (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "role": "CLIENT",
  "description": "Успешный вход"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Неверный логин или пароль"
}
```
### 2.2.1 Регистрация физического лица (INDIVIDUAL)
Регистрация нового пользователя с типом "Физическое лицо". Данные сохраняются в таблицы `users` и `individual_details`.

**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  

**Тело запроса (Body):**
```json
{
    "login": "kirill_petrov",
    "password": "securepass123",
    "type": "INDIVIDUAL",
    "individual_details": {
        "first_name": "Кирилл",
        "last_name": "Петров",
        "middle_name": "Дмитриевич",
        "phone": "+79991234567",
        "birth_date": "2000-01-01",
        "passport_series": "4510",
        "passport_number": "123456"
    }
}
**Успешный ответ (201 Created):**
```json
{
  "login": "kirill_petrov",
  "description": "Успешная регистрация"
}
```
**Безуспешный ответ (409 Conflict):**
```json
{
  "error": "Conflict",
  "message": "Пользователь с таким логином уже существует",
  "field": "login"
}
```
### 2.2 Регистрация юридического лица (LEGAL)
Регистрация нового пользователя LEGAL<br/>

**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  
**Тело запроса (Body):**
```json
{
    "login": "xromzas_software_llc",
    "password": "securepass",
    "type": "LEGAL",
    "legal_details": {
        "company_name": "ООО Программное Обеспечение ИксРомзас",
        "inn" :"1337069420",
        "legal_address": "г. Москва, ул. Заводская, 10",
        "kpp": "177301001",
        "ogrn": "1027710132195"
    }
}
```
**Успешный ответ (201 Created):**
```json
{
  "login": "xromzas_software_llc",
  "description": "Успешная регистрация"
}
```
**Безуспешный ответ (409 Conflict):**
```json
{
  "error": "Conflict",
  "message": "Пользователь с таким логином уже существует",
  "field": "login"
}
```


### 2.3 Обновление токена (Refresh)
Обновление JWT-токена по Refresh-токену<br/>

**Метод:** `POST`  
**Путь:** `/auth/refresh`  
**Доступ:** Всем  
**Cookie:** Достаёт данные из refreshToken cookie

**Успешный ответ (201 Created):**
```json
{
  "token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "type": "Bearer"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Токен устарел, войдите ещё раз",
}
```
## 3. Профиль (Profile)
Просмотр информации о профиле клиента
### 3.1 Данные клиента
Получение данных об аккаунте<br/>

**Метод:** `GET`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
**Тело запроса (Body):** *Отсутствует*<br/>
**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "login": "kirill_petrov",
  "full_name": "Петров Кирилл Дмитриевич",
  "role": "CLIENT",
  "created_at": "2026-03-15T12:00:00"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к профилю необходимо авторизоваться"
}
```
## 4. История заказов (Order History)
Просмотр информации о истории заказов клиента
### 4.1 Список заказов
Получение списка о заказах<br/>

**Метод:** `GET`  
**Путь:** `/order_history`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>
**Параметры (Query):**
* `page` (int) — номер страницы (с 0)
* `size` (int) — элементов на странице

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1024,
    "date": "2026-03-20T15:30:00",
    "total_price": 2450.00,
    "status": "DELIVERED",
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "warehouse_id": 1,
    "items_count": 3
  },
  {
    "id": 1056,
    "date": "2026-04-01T10:15:00",
    "total_price": 120.50,
    "status": "IN_PROGRESS",
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "warehouse_id": 2,
    "items_count": 1
  }
]
```
### 4.2 Информация о заказе
Получение информации о конкретном заказе<br/>

**Метод:** `GET`  
**Путь:** `/order_history/{id}`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
{
    "id": 1024,
    "date": "2026-03-20T15:30:00",
    "status": "DELIVERED",
    "total_price": 2450.00,
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "status_history": [
        {
            "status": "NEW",
            "changed_at": "2026-03-21T18:00:00",
            "changed_by_name": "System"
        },
        {
            "status": "ASSEMBLING",
            "changed_at": "2026-03-21T18:45:00",
            "changed_by_name": "Мадин (Менеджер)"
        },
        {
            "status": "DELIVERING",
            "changed_at": "2026-03-21T19:30:00",
            "changed_by_name": "Мадин (Менеджер)"
        }
    ],
    "items": [
        {
            "product_id": 1,
            "title": "Ультразвуковой датчик HC-SR04",
            "quantity": 2,
            "price_at_purchase": 250.00,
            "total_item_price": 500.00
        },
        {
            "product_id": 42,
            "title": "Корпус для Arduino",
            "quantity": 1,
            "price_at_purchase": 1950.00,
            "total_item_price": 1950.00
        }
    ]
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
    "error": "Not Found",
    "message": "Заказ не найден"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к заказам необходимо авторизоваться"
}
```
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас нет доступа к этому заказу"
}
```
## 5. Корзина (Cart)
Просмотр корзины клиента
### 5.1 Список товаров в корзине
Получение списка товаров в корзине<br/>

**Метод:** `GET`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>
**Параметры (Query):**
* `page` (int) — номер страницы (с 0)
* `size` (int) — элементов на странице

**Успешный ответ (200 OK):**
```json
{
    "items": [
        {
            "id": 1,
            "title": "Ультразвуковой датчик HC-SR04",
            "quantity":12,
            "applied_price": 180.50,
            "price_type": "WHOLESOME",
            "subtotal": 2166.00
        },
        {
            "id": 2,
            "title": "Плата Arduino Uno R3",
            "quantity":12,
            "applied_price": 180.50,
            "price_type": "WHOLESOME",
            "subtotal": 2166.00
        }
    ],
    "total_price": 4566.00
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```
### 5.2 Удаление товара из корзины
Удаление товара из корзины<br/>

**Метод:** `DELETE`  
**Путь:** `/cart/{product_id}`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Ультразвуковой датчик HC-SR04",
    "message": "Успешно удалено из корзины"
  }
]
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```

### 5.3 Очистка корзины
Удаление всех товаров из корзины<br/>

**Метод:** `DELETE`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
{
    "count": 2,
    "message": "Товары успешно удалены из корзины"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```
## 6. Оформление заказа (Checkout)
Интерфейс оформления заказа
### 6.1 Создание заказа всей корзины
Офомление заказа со всеми товарами из корзины

**Метод:** `POST`  
**Путь:** `/orders`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "warehouse_id": 1,
  "address": "г. Москва, ул. Арбат, д. 1"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1025,
  "status": "NEW",
  "total_price": 1450.00,
  "message": "Заказ успешно оформлен, корзина очищена"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для оформления заказа необходимо авторизоваться"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Недостаточно товара на складе: Датчик HC-SR04"
}
```
### 6.2 Создание заказа одного товара
Офомление заказа со всеми товарами из корзины

**Метод:** `POST`  
**Путь:** `/orders`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "warehouse_id": 1,
  "address": "г. Москва, ул. Арбат, д. 1",
  "product_id": 1,
  "quantity": 5,
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1026,
  "status": "NEW",
  "total_price": 1450.00,
  "message": "Заказ успешно оформлен"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для оформления заказа необходимо авторизоваться"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Недостаточно товара на складе: Датчик HC-SR04"
}
```

## 7. Панель управления (Admin/Manager)
Эндпоинты для сотрудников для управления контентом и логистикой.
### 7.1 Обновление статуса заказа
Офомление заказа со всеми товарами из корзины

**Метод:** `PATCH`  
**Путь:** `/admin/orders/{id}/status`  
**Доступ:** `MANAGER`, `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "new_status": "ASSEMBLING",
  "comment": "Начата сборка на складе №1"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1025,
  "status": "ASSEMBLING",
  "updated_at": "2026-03-21T18:45:00",
  "changed_by": "madin_manager"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.2 Обновление остатков на складе
Офомление заказа со всеми товарами из корзины

**Метод:** `PUT`  
**Путь:** `/admin/stock`  
**Доступ:** `MANAGER`, `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "product_id": 1,
  "warehouse_id": 1,
  "quantity": 50 
}
```
**Успешный ответ (200 OK):**
```json
{
    "message": "Успешно установлено"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.3 Создание товаров
Добавление позиции в таблицу `products`.

**Метод:** `POST`  
**Путь:** `/admin/products`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "title": "Новый контроллер STM32",
  "description": "Мощный микроконтроллер для профи",
  "price_retail": 1500.00,
  "price_wholesome": 1100.00,
  "wholesale_threshold": 5,
  "category_id": 2,
  "weight": 0.5,
  "size": "5x5 см"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 135,
  "title": "Новый контроллер STM32",
  "description": "Мощный микроконтроллер для профи",
  "price_retail": 1500.00,
  "price_wholesome": 1100.00,
  "wholesale_threshold": 5,
  "category_id": 2,
  "weight": 0.5,
  "size": "5x5 см"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.4 Список всех пользователей
Получение списка всех пользователей из таблицы `users`

**Метод:** `GET`  
**Путь:** `/admin/users`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует* 

**Успешный ответ (200 OK):**
```json
[
    {
        "id": 1,
        "login": "pavalapi",
        "created_at": "2026-03-21T18:45:00",
        "role": "CLIENT" 
    },
    {
        "id": 2,
        "login": "xromza",
        "created_at": "2026-03-16T5:12:03",
        "role": "ADMIN" 
    },
    {
        "id": 3,
        "login": "madin_tashu",
        "created_at": "2026-03-16T5:30:03",
        "role": "MANAGER" 
    }
]
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.5 Изменение роли пользователя
Изменение роли пользователю в таблице `users`

**Метод:** `PATCH`  
**Путь:** `/admin/users/{id}/role`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "role": "ADMIN",
}
```
**Успешный ответ (200 OK):**
```json
{
    "id": 1,
    "login": "pavalapi",
    "created_at": "2026-03-21T18:45:00",
    "role": "ADMIN" 
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```