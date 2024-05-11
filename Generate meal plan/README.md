# Hướng dẫn chạy code generate

## 1. Cài thư viện python

```bash
pip install -r requirements.txt
```

## 2. Chạy sever.py

- Vào thư mục **Source**

  ```bash
  uvicorn sever:app
  ```

- Mở "http://127.0.0.1:8000/docs" để truyền tham số
- Chọn trong GET /calculate_meals_for_days, và truyền tham số tương ứng (nhấp "Try it out").
  ![Ảnh minh họa](Generate meal plan/fastapi_docs.jpg)
- Chú thích các tham số:
  - **days**: số ngày cần gen (mặc định là 7)
  - **low_salt**: có chọn ít muối (mặc định là False)
  - **low_cholesterol**: có chọn ít cholesterol (mặc định là False)
  - **fibre_limit**, **kcal_limit**, **carb_kcal_limit**, **protein_kcal_limit**, **fat_kcal_limit**: (Không truyền tham số cũng được)
  - **cost_limit**: (mặc định là 300k, số này phù hợp nha, khỏi sửa cũng được)
  - **meal_count_str**: tại trong link tui chưa biết chèn mảng vô như nào, nên xài tạm chuỗi, rồi tui chuyển lại qua mảng nha.
    Ví dụ: "1,0,2,2,0"
    $\rightarrow$ 1 meal for Breakfast, 0 meal for Elevenses, 2 meals for Lunch, 2 meals for Dinner, 0 meal for Snack.
  - Ngoài ra, còn banned_recipes, mà tui chưa muốn đụng đến, tại cũng giống cái trên là phải truyền chuỗi. Tui đang nghĩ cách khác.
- Chỉnh sửa xong thì lấy link chạy lại là có dữ liệu nha!
  Link kết quả: http://127.0.0.1:8000/calculate_meals_for_days?days=7&low_salt=false&low_cholesterol=false&meal_count_str=1%2C%200%2C%202%2C%202%2C%200
