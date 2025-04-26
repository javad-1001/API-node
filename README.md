# Node.js REST API

این یک REST API با استفاده از Node.js، Express و MySQL است.

## نصب و راه‌اندازی

1. نصب وابستگی‌ها:
```bash
npm install
```

2. ایجاد فایل .env:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beh
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

3. اجرای برنامه:
```bash
# حالت توسعه
npm run dev

# حالت تولید
npm start
```

## API Endpoints

### احراز هویت
- `POST /api/auth/login`: ورود کاربر
  ```json
  {
    "strUsername": "username",
    "strPassword": "password"
  }
  ```

### محصولات
همه endpoint های زیر نیاز به توکن JWT در هدر Authorization دارند:
```
Authorization: Bearer <your_token>
```

- `GET /api/products/getAllProducts`: دریافت همه محصولات
- `POST /api/products/addProduct`: افزودن محصول جدید
- `POST /api/products/deleteProduct`: حذف محصول
- `PUT /api/products/editProduct/:iProduct`: ویرایش محصول

## ساختار پروژه

```
src/
├── config/         # تنظیمات برنامه
├── controllers/    # کنترلرها
├── middleware/     # میان‌افزارها
├── models/        # مدل‌های دیتابیس
├── routes/        # مسیرها
├── utils/         # توابع کمکی
└── app.js         # فایل اصلی برنامه
``` 