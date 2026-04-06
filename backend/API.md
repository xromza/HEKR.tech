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

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=price,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 42,
    "title": "Худи 'Over-size' Базовое",
    "price_retail": 4500.00,
    "price_wholesale": 3800.00
  },
  {
    "id": 15,
    "title": "Футболка 'Minimalism' Белая",
    "price_retail": 1800.00,
    "price_wholesale": 1400.00
  },
  {
    "id": 8,
    "title": "Джоггеры 'City-Style' Черные",
    "price_retail": 3200.00,
    "price_wholesale": 2700.00
  }
]
```
### 1.2. Найти товары по имени
**Метод:** `GET`  
**Путь:** `/products/search`  
**Доступ:** Всем  

**Параметры (Query):**
#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=price_retail,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **query** | `string` | Строка поиска. | `?query='датчик'` |

**Пример запроса**
`GET /products/search?query="датчик"`
**Успешный ответ (200 OK):**
```json
[
    {
        "id": 1,
        "title": "Ультразвуковой датчик HC-SR04",
        "price_retail": 250.00,
        "price_wholesale": 180.50
    }
]
```
### 1.3 Информация о товаре
Получение детальной информации о модели товара, списке доступных модификаций и остатках.

**Метод:** `GET`  
**Путь:** `/products/{id}`  
**Доступ:** Все пользователи  

**Параметры запроса (Query Parameters):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **variant_id** | `int` | ID конкретной модификации. Если не указан, возвращается информация о первом доступном варианте. | `?variant_id=4` |

**Успешный ответ (200 OK):**
```json
{
    "id": 42,
    "title": "Худи 'Over-size' Базовое",
    "description": "Плотный хлопок, свободный крой. Идеально для учебы в университете и долгих сессий кодинга.",
    "category_id": 5,
    "price_retail": 4500.00,
    "wholesale_threshold": 10,
    "selected_variant": {
        "id": 101,
        "sku": "HD-BLK-XL",
        "size": "XL",
        "color": "Черный",
        "weight": 0.85,
        "stock": [
            {
                "warehouse_id": 1,
                "address": "г. Москва ул. Складская д. 3",
                "quantity": 15
            },
            {
                "warehouse_id": 2,
                "address": "г. Краснодар ул. Красная 140",
                "quantity": 2
            }
        ]
    },
    "all_variants": [
        {
            "id": 101,
            "size": "XL",
            "color": "Черный"
        },
        {
            "id": 102,
            "size": "L",
            "color": "Черный"
        },
        {
            "id": 103,
            "size": "XL",
            "color": "Серый меланж"
        }
    ]
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
    "error": "Not Found",
    "message": "Товар или указанный вариант не найден"
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
### 2.2.2 Регистрация юридического лица (LEGAL)
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
#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=date,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

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
    "total_price": 41800.00,
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "status_history": [
        {
            "status": "NEW",
            "changed_at": "2026-03-20T15:30:00",
            "changed_by_name": "System"
        },
        {
            "status": "ASSEMBLING",
            "changed_at": "2026-03-21T10:45:00",
            "changed_by_name": "Мадин (Менеджер)"
        },
        {
            "status": "DELIVERED",
            "changed_at": "2026-03-23T14:20:00",
            "changed_by_name": "Система (Автоматически)"
        }
    ],
    "items": [
        {
            "product_id": 42,
            "variant_id": 101,
            "title": "Худи 'Over-size' Базовое",
            "sku": "HD-BLK-XL",
            "size": "XL",
            "color": "Черный",
            "quantity": 10,
            "price_at_purchase": 3800.00,
            "total_item_price": 38000.00
        },
        {
            "product_id": 15,
            "variant_id": 205,
            "title": "Футболка 'Minimalism' Белая",
            "sku": "TSH-WHT-M",
            "size": "M",
            "color": "Белый",
            "quantity": 2,
            "price_at_purchase": 1900.00,
            "total_item_price": 3800.00
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
            "product_id": 42,
            "variant_id": 101,
            "title": "Худи 'Over-size' Базовое",
            "sku": "HD-BLK-XL",
            "size": "XL",
            "color": "Черный",
            "quantity": 12,
            "applied_price": 3800.00,
            "price_type": "WHOLESALE",
            "subtotal": 45600.00
        },
        {
            "product_id": 15,
            "variant_id": 205,
            "title": "Футболка хлопок 100%",
            "sku": "TSH-WHT-M",
            "size": "M",
            "color": "Белый",
            "quantity": 2,
            "applied_price": 1500.00,
            "price_type": "RETAIL",
            "subtotal": 3000.00
        }
    ],
    "total_price": 48600.00
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
**Путь:** `/cart/{variant_id}`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
[
  {
    "variant_id": 101,
    "title": "Худи 'Over-size' Базовое (XL, Черный)",
    "message": "Позиция успешно удалена из корзины"
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
**Безуспешный ответ (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Данный товар не найден в вашей корзине"
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
### 5.4 Добавление или изменение количества
Добавление товара в корзину или обновление его количества.

**Метод:** `POST`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  

**Тело запроса (Body):**
```json
{
  "variant_id": 101,
  "quantity": 5
}
```
**Успешный ответ (200 OK):**
```json
{
  "variant_id": 101,
  "current_quantity": 5,
  "message": "Корзина обновлена"
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
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment_method": "CARD"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1025,
  "status": "NEW",
  "total_price": 41800.00,
  "payment_method": "CARD",
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
  "message": "Недостаточно товара на складе: Худи 'Over-size' (XL, Черный). Доступно: 2 шт."
}
```
### 6.2 Создание заказа одного товара
Офомление заказа со всеми товарами из корзины

**Метод:** `POST`  
**Путь:** `/orders/single`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "warehouse_id": 1,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "variant_id": 101,
  "quantity": 5
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1026,
  "status": "NEW",
  "total_price": 19000.00,
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
  "message": "Недостаточно товара на складе: Худи 'Over-size' (XL, Черный). Доступно: 2 шт."
}
```

## 7. Панель управления (Admin/Manager)
Эндпоинты для сотрудников для управления контентом и логистикой.
### 7.1 Обновление статуса заказа
Изменение статуса заказа и добавление комментария к истории

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
Установка текущего количества товара на конкретном складе

**Метод:** `PUT`  
**Путь:** `/admin/stock`  
**Доступ:** `MANAGER`, `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "variant_id": 1,
  "warehouse_id": 1,
  "quantity": 50 
}
```
**Успешный ответ (200 OK):**
```json
{
    "message": "Остатки успешно обновлены"
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
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "weight": 0.85,
  "size": "XL",
  "color": "Черный"
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 42,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [
    {
      "id": 101,
      "sku": "HD-BLK-XL",
      "size": "XL",
      "color": "Черный",
      "weight": 0.85
    }
  ]
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Ошибка валидации: поле 'title' не может быть пустым"
}
```

**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN)"
}
```
### 7.4 Список всех пользователей
Метод предназначен для административного управления доступом. Позволяет просматривать базу пользователей с применением гибкой фильтрации по статусу верификации и сортировки.

**Метод:** `GET`  
**Путь:** `/admin/users`  
**Доступ:** `ADMIN`  
**Заголовки (Headers):** `Authorization: Bearer <your_token_here>`

---

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **approved** | `boolean` | Фильтр по статусу `is_approved`. `false` — только те, кто ждет подтверждения. | `?approved=false` |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=login,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

---

#### Тело запроса (Body)
*Отсутствует*

---

#### Успешный ответ (200 OK)
Возвращает массив объектов пользователей, соответствующих заданным фильтрам.

```json
[
    {
        "id": 1,
        "login": "pavalapi",
        "created_at": "2026-03-21T18:45:00",
        "role": "LEGAL",
        "is_approved": false
    },
    {
        "id": 2,
        "login": "xromza",
        "created_at": "2026-03-16T05:12:03",
        "role": "ADMIN",
        "is_approved": true
    },
    {
        "id": 4,
        "login": "kklaha",
        "created_at": "2026-03-21T18:45:00",
        "role": "INDIVIDUAL",
        "is_approved": true
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
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас недостаточно прав для выполнения этой операции"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Указано несуществующее поле для сортировки"
}
```


### 7.5 Изменение данных пользователя
Изменение данных пользователя в таблице `users`

**Метод:** `PATCH`  
**Путь:** `/admin/users/{id}`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (id=1) (Body):**
```json
{
  "is_approved": true
}
```
**Успешный ответ (200 OK):**
```json
{
    "id": 1,
    "login": "pavalapi",
    "created_at": "2026-03-21T18:45:00",
    "role": "LEGAL",
    "is_approved": true 
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Тело запроса (Body):**
```json
{
  "role": "ADMIN",
  "is_approved": true
}
```
**Успешный ответ (id=4)(200 OK):**
```json
{

    "id": 4,
    "login": "kklaha",
    "created_at": "2026-03-21T18:45:00",
    "role": "ADMIN",
    "is_approved": true
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Пользователь с таким ID не найден"
}
```
### 7.6 Создание склада
Добавление склада в таблицу `warehouses`.

**Метод:** `POST`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 1337,
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.7 Список всех складов
Позволяет просматривать базу складов

**Метод:** `GET`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`, `MANAGER`
**Заголовки (Headers):** `Authorization: Bearer <your_token_here>`

---

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **address** | `string` | Поиск по строке | `?address=Москва` |

---

#### Тело запроса (Body)
*Отсутствует*

---

#### Успешный ответ (200 OK)
Возвращает массив объектов складов

```json
[
    {
        "id": 1,
        "address": "г. Москва ул. Складская д. 3"
    },
    {
        "id": 2,
        "address": "г. Великие Луки ул. Потайная д. 341/1"
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
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас недостаточно прав для выполнения этой операции"
}
```