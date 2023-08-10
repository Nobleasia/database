# Dokumentasi API NPA

API ini dibuat menggunakan teknologi berikut:

1. Express.js
2. MySQL
3. Sequelize

## API Version

- 1.0

## Endpoint

https://npa-database-production.up.railway.app

# User

## Register

- ### URL
  - /users/register
- ### Method
  - POST
- ### Request Body Example
  - `username` pengguna harus _unique_
  - `username`, `fullname`, `role`, dan `password` harus diisi
  - Setiap pengguna hanya bisa mempunyai salah satu dari 3 `role`, yaitu
    (`superadmin`)/(`admin`)/(`user`)
  ```json
  {
    "username": "root",
    "fullname": "tes123",
    "role": "superadmin",
    "password": "forgetitatyourownrisk"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "users",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "username": "username has been taken"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 9:45:05 PM"
      }
    }
    ```

## Login

- ### URL
  - /users/login
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "username": "root",
    "password": "forgetitatyourownrisk"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "bearer_token",
        "attributes": {
          "user_role": "superadmin",
          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJSb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTY3NDM5NjY4NCwiZXhwIjoxNjc0Mzk2Njk5LCJhdWQiOiJucGEuY29tIiwiaXNzIjoiYXBpLm5wYS5jb20ifQ.eBw_3B2MGCFMa6IRIOm_ff_DWf8i29fy3mRMPlP3t_Y"
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "password": "password is wrong"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:52:34 PM"
      }
    }
    ```

## Get all `User`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `User` yang terdaftar di
    dalam database
- ### URL
  - /users/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "users",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 1,
          "total_data_count": 1,
          "total_pages": 1,
          "records": [
            {
              "username": "root",
              "fullname": "Superadmin",
              "role": "superadmin",
              "updated_at": "2023-06-30T02:19:21.000Z"
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/30/2023, 11:09:04 AM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```

  - #### User

    - Username

      - Fungsi:
        - Untuk mencari user berdasarkan `username` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        username: string;
        ```

      - Contoh request:
        1. Mencari user dengan username `root`
           ```txt
           BASE_URL/users/read?username=root
           ```
        2. Mengurutkan user berdasarkan `username` secara `ascending`
           ```txt
           BASE_URL/users/read?username=ASC
           ```
        3. Mengurutkan user berdasarkan `username` secara `descending`
           ```txt
           BASE_URL/users/read?username=DESC
           ```

    - Fullname

      - Fungsi:
        - Untuk mencari user berdasarkan `fullname` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        fullname: string;
        ```

      - Contoh request:
        1. Mencari user dengan fullname `Superadmin`
           ```txt
           BASE_URL/users/read?fullname=Superadmin
           ```
        2. Mengurutkan user berdasarkan `fullname` secara `ascending`
           ```txt
           BASE_URL/users/read?fullname=ASC
           ```
        3. Mengurutkan user berdasarkan `fullname` secara `descending`
           ```txt
           BASE_URL/users/read?fullname=DESC
           ```

    - Role

      - Fungsi:
        - Untuk mencari user berdasarkan `role` user tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        role: string;
        ```

      - Contoh request:
        1. Mencari user dengan role `superadmin`
           ```txt
           BASE_URL/users/read?role=superadmin
           ```
        2. Mencari user dengan role `admin`
           ```txt
           BASE_URL/users/read?role=admin
           ```
        3. Mencari user dengan role `user`
           ```txt
           BASE_URL/users/read?role=user
           ```

    - Updated At

      - Fungsi:
        - Untuk mencari user berdasarkan `updated_at` user tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        updated_at: string;
        ```

      - Contoh request:
        1. Mengurutkan user berdasarkan `updated_at` secara `ascending`
           ```txt
           BASE_URL/users/read?updated_at=ASC
           ```
        2. Mengurutkan user berdasarkan `updated_at` secara `descending`
           ```txt
           BASE_URL/users/read?updated_at=DESC
           ```

## Update specific `User` by username

- Description:

  - Berfungsi untuk mengubah data `user` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `username` dalam bentuk `string`.
    Contoh: `BASE_URL/users/update/user123`
  - User `root` tidak bisa diubah

- ### URL
  - /users/update/:username
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    application/json
    ```

  - #### Optional input attribute `:` `Data type`

    - username
      ```ts
      username: string;
      ```
    - name
      <br />Untuk mengubah `name` dari `user`
      ```ts
      name: string;
      ```
    - role
      <br />Untuk mengubah `role` dari `user`
      ```ts
      role: string;
      ```
      Aturan perubahan `role`: <br />
      1. value yang diterima hanya `superadmin`, `admin`, dan `user` <br />
      2. penambahan role dari atau menjadi `admin` hanya dapat dilakukan `superadmin` <br />
      3. penambahan role dari atau menjadi `superadmin` hanya dapat dilakukan `root` <br />
    - password
      <br />Untuk mengubah `password` dari `user`
      ```ts
      password: string;
      ```

- ### Response

  - Expected output:

    ```txt
    Return 204 No Content and Empty Body Response
    ```

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "name": "name must be string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Delete specific `User` by username

- Description:
  - Berfungsi untuk menghapus satu data `User` sesuai dengan `username`
    dari database
  - Membutuhkan `route parameter` berupa `username` dalam bentuk `string`.
    Contoh: `BASE_URL/users/delete/user123`
  - Penghapusan `admin` hanya dapat dilakukan oleh `superadmin`
  - Penghapusan `superadmin` hanya dapat dilakukan oleh `root`
  - User `root` tidak dapat dihapus
- ### URL
  - /users/delete/:username
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "username": "username not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap user berdasarkan `username`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

## Access Token

- ### Description:

  - Membutuhkan `Authorization` Header berisikan `bearer token`

- ### URL
  - /users/access_token
- ### Method
  - GET
- ### Response
  - Expected output jika access token sudah expired:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Refresh Token

- ### URL
  - /users/refresh_token
- ### Method
  - GET
- ### Response
  - Expected output jika access token sudah expired:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "bearer_token",
        "attributes": {
          "user_role": "superadmin",
          "new_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJSb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTY3NDM5OTI2OSwiZXhwIjoxNjc0Mzk5Mjg0LCJhdWQiOiJucGEuY29tIiwiaXNzIjoiYXBpLm5wYS5jb20ifQ.lC3IsB64pQUFLRf3RAi9l_bF8ky_X0VObTtqii7zgao"
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:54:29 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "refresh_token": "refresh token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Logout

- Description:

  - Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
    diakses

- ### URL
  - /users/logout
- ### Method
  - GET
- ### Response
  - Expected output jika access token sudah expired:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "logout",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:54:29 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "invalid signature"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/23/2023, 2:26:38 PM"
      }
    }
    ```

# Property.Area

- Merupakan API berkaitan dengan zona atau lokasi properti
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new area

- Description:

  - Berfungsi untuk menambahkan data `region_name` baru

- ### URL
  - /property/areas/create
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "region_name": "Ancol"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_areas",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "region_name": "region_name must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Area`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Area` yang terdaftar di
    dalam database
- ### URL
  - /property/areas/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_areas",
        "attributes": [
          {
            "id": 1,
            "region_name": "Ampera",
            "created_at": "2023-01-26T09:56:14.000Z",
            "updated_at": "2023-01-26T09:56:14.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific region name

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Area` sesuai dengan
    `region_name` yang diinginkan
  - Membutuhkan `query parameter` berupa `region_name` dengan tipe data
    `string`. Contoh: `BASE_URL/property/areas/read?region_name=Ampera`
- ### URL
  - /property/areas/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_areas",
        "attributes": [
          {
            "id": 1,
            "region_name": "Ampera",
            "created_at": "2023-01-26T09:56:14.000Z",
            "updated_at": "2023-01-26T09:56:14.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "region_name": "region_name not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Area` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Area` sesuai dengan `id`
    yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/areas/read/1`
- ### URL
  - /property/areas/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_areas",
        "attributes": {
          "id": 1,
          "region_name": "Ampera",
          "created_at": "2023-01-26T09:56:14.000Z",
          "updated_at": "2023-01-26T09:56:14.000Z"
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update region name

- Description:
  - Berfungsi untuk mengubah data `region_name` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/areas/update/1`
  - Perlu body request berupa `region_name` baru yang akan mengubah data
    `Property Area` yang sudah terdaftar
- ### URL
  - /property/areas/update/:id
- ### Method
  - PUT
- ### Request Body Example
  ```json
  {
    "new_region_name": "Bekasi"
  }
  ```
- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Area` by id

- Description:
  - Berfungsi untuk menghapus satu data `Property Area` sesuai dengan `id` dari
    database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/areas/delete/1`
- ### URL
  - /property/areas/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Property Area` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_photos`, `apartment_facilities`, dan `apartments` yang mempunyai id `Property Area` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# Property.PersonInChargeCompany

- Merupakan API berkaitan dengan perusahaan dari pemilik properti
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new person in charge company

- Description:

  - Berfungsi untuk menambahkan data company `name` baru untuk PIC

- ### URL
  - /property/person_in_charge_companies/create
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "name": "Company A"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_person_in_charge_companies",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "name": "name must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Person In Charge Company`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge Company` yang
    terdaftar di dalam database
- ### URL
  - /property/person_in_charge_companies/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_companies",
        "attributes": [
          {
            "id": 1,
            "name": "Company A",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          },
          {
            "id": 2,
            "name": "Company B",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:37:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge Company`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge Company`
    sesuai dengan company `name` yang diinginkan
- Route Parameter:
  - `name`
    - Contoh: `BASE_URL/property/person_in_charge_companies/read?name=Company%20A`
- ### URL
  - /property/person_in_charge_companies/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_companies",
        "attributes": [
          {
            "id": 1,
            "name": "Company A",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "person_in_charge_companies": "person_in_charge_companies not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge Company` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge Company` sesuai
    dengan `id` yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_companies/read/1`
- ### URL
  - /property/person_in_charge_companies/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_companies",
        "attributes": {
          "id": 1,
          "name": "Company A",
          "created_at": "2023-05-03T08:46:05.000Z",
          "updated_at": "2023-05-03T08:46:05.000Z",
          "deletedAt": null
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update `Property Person In Charge Company`

- Description:

  - Berfungsi untuk mengubah data `Property Person In Charge Company` yang sudah
    terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_companies/update/1`

- Property yang dapat diubah:
  ```ts
  new_name: string;
  ```
- ### URL
  - /property/person_in_charge_companies/update/:id
- ### Method
  - PUT
- ### Request Body Example
  ```json
  {
    "new_name": "Company X"
  }
  ```
- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Person In Charge Company` by id

- Description:
  - Berfungsi untuk menghapus `(soft-delete)` satu data
    `Property Person In Charge Company` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_companies/delete/1`
- ### URL
  - /property/person_in_charge_companies/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Person in Charge Company` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_photos`, `apartment_facilities`, `apartments`, dan `person_in_charges` yang mempunyai id `Property Person in Charge Company` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

## Restore specific `Property Person In Charge Company` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge Company` yang
    sudah terhapus `(soft-delete)` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_companies/restore/1`
- ### URL
  - /property/person_in_charge_companies/restore/:id
- ### Method
  - PUT
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_companies",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:49:16 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "person_in_charge": "person_in_charge is not deleted"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:26:11 PM"
      }
    }
    ```

# Property.PersonInChargeRole

- Merupakan API berkaitan dengan perusahaan dari pemilik properti
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new person in charge role

- Description:

  - Berfungsi untuk menambahkan data role `name` baru untuk PIC

- ### URL
  - /property/person_in_charge_roles/create
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "name": "Manager"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_person_in_charge_roles",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "name": "name must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Person In Charge Role`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge Role` yang
    terdaftar di dalam database
- ### URL
  - /property/person_in_charge_roles/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_roles",
        "attributes": [
          {
            "id": 1,
            "name": "Manager",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          },
          {
            "id": 2,
            "name": "Owner",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:37:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge Role`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge Role`
    sesuai dengan company `name` yang diinginkan
- Route Parameter:
  - `name`
    - Contoh: `BASE_URL/property/person_in_charge_roles/read?name=Manager`
- ### URL
  - /property/person_in_charge_roles/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_roles",
        "attributes": [
          {
            "id": 1,
            "name": "Manager",
            "created_at": "2023-05-03T08:46:05.000Z",
            "updated_at": "2023-05-03T08:46:05.000Z",
            "deletedAt": null
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "person_in_charge_roles": "person_in_charge_roles not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge Role` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge Role` sesuai
    dengan `id` yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_roles/read/1`
- ### URL
  - /property/person_in_charge_roles/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_roles",
        "attributes": {
          "id": 1,
          "name": "Manager",
          "created_at": "2023-05-03T08:46:05.000Z",
          "updated_at": "2023-05-03T08:46:05.000Z",
          "deletedAt": null
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update `Property Person In Charge Role`

- Description:

  - Berfungsi untuk mengubah data `Property Person In Charge Role` yang sudah
    terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_roles/update/1`

- Property yang dapat diubah:
  ```ts
  new_name: string;
  ```
- ### URL
  - /property/person_in_charge_roles/update/:id
- ### Method
  - PUT
- ### Request Body Example
  ```json
  {
    "new_name": "Caretaker"
  }
  ```
- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Person In Charge Role` by id

- Description:
  - Berfungsi untuk menghapus `(soft-delete)` satu data
    `Property Person In Charge Role` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_roles/delete/1`
- ### URL
  - /property/person_in_charge_roles/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Person in Charge Role` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_photos`, `apartment_facilities`, `apartments`, dan `person_in_charges` yang mempunyai id `Property Person in Charge Role` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

## Restore specific `Property Person In Charge Role` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge Role` yang
    sudah terhapus `(soft-delete)` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charge_roles/restore/1`
- ### URL
  - /property/person_in_charge_roles/restore/:id
- ### Method
  - PUT
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charge_roles",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:49:16 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "person_in_charge": "person_in_charge is not deleted"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:26:11 PM"
      }
    }
    ```

# Property.PersonInCharge

- Merupakan API berkaitan dengan pemilik properti
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new person in charge

- Description:

  - Berfungsi untuk menambahkan data `fullname`, `role`, `company`, dan
    `phone_number` baru

- ### URL
  - /property/person_in_charges/create
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "fullname": "Andi Muhammad Rezki",
    "role": "Manager",
    "company": "Company A",
    "phone_number": "082144569073"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_person_in_charges",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "fullname": "fullname must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Person In Charge`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge` yang
    terdaftar di dalam database
- ### URL
  - /property/person_in_charges/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charges",
        "attributes": [
          {
            "id": 1,
            "fullname": "Andi Muhammad Rezki",
            "phone_number": "082144569073",
            "created_at": "2023-05-03T08:46:09.000Z",
            "updated_at": "2023-05-03T08:46:09.000Z",
            "property_person_in_charge_company": {
              "id": 1,
              "name": "Company A"
            },
            "property_person_in_charge_role": {
              "id": 1,
              "name": "Manager"
            }
          },
          {
            "id": 2,
            "fullname": "Donny Setiawan",
            "phone_number": "081366004444",
            "created_at": "2023-05-03T08:46:09.000Z",
            "updated_at": "2023-05-03T08:46:09.000Z",
            "property_person_in_charge_company": {
              "id": 2,
              "name": "Company B"
            },
            "property_person_in_charge_role": {
              "id": 1,
              "name": "Owner"
            }
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:37:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Person In Charge`
    sesuai dengan `role` atau `company` yang diinginkan
- Route Parameter:
  - `role`
    - Contoh: `BASE_URL/property/person_in_charges/read?role=Management`
  - `company`
    - Contoh: `BASE_URL/property/person_in_charges/read?company=Andi Empire`
- ### URL
  - /property/person_in_charges/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charges",
        "attributes": [
          {
            "id": 1,
            "fullname": "Andi Muhammad Rezki",
            "phone_number": "082144569073",
            "created_at": "2023-05-03T08:46:09.000Z",
            "updated_at": "2023-05-03T08:46:09.000Z",
            "property_person_in_charge_company": {
              "id": 1,
              "name": "Company A"
            },
            "property_person_in_charge_role": {
              "id": 1,
              "name": "Manager"
            }
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "person_in_charge": "person_in_charge not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific `Property Person In Charge` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge` sesuai
    dengan `id` yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charges/read/1`
- ### URL
  - /property/person_in_charges/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charges",
        "attributes": {
          "id": 1,
          "fullname": "Andi Muhammad Rezki",
          "phone_number": "082144569073",
          "created_at": "2023-05-03T08:46:09.000Z",
          "updated_at": "2023-05-03T08:46:09.000Z",
          "property_person_in_charge_company": {
            "id": 1,
            "name": "Company A"
          },
          "property_person_in_charge_role": {
            "id": 1,
            "name": "Manager"
          }
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 1:56:52 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update `Property Person In Charge`

- Description:

  - Berfungsi untuk mengubah data `Property Person In Charge` yang sudah
    terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charges/update/1`

- Property yang dapat diubah:
  ```ts
    new_fullname     : string
    new_role         : string
    new_company      : string
    new_phone_number : string of number
  ```
- ### URL
  - /property/person_in_charges/update/:id
- ### Method
  - PUT
- ### Request Body Example
  ```json
  {
    "new_fullname": "Andi Tornanda Pasaribu"
  }
  ```
- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Person In Charge` by id

- Description:
  - Berfungsi untuk menghapus `(soft-delete)` satu data
    `Property Person In Charge` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charges/delete/1`
- ### URL
  - /property/person_in_charges/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Person in Charge` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_photos`, `apartment_facilities` dan `apartments` yang mempunyai id `Property Person in Charge` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

## Restore specific `Property Person In Charge` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Person In Charge` yang
    sudah terhapus `(soft-delete)` sesuai dengan `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/person_in_charges/restore/1`
- ### URL
  - /property/person_in_charges/restore/:id
- ### Method
  - PUT
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_person_in_charges",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:49:16 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "person_in_charge": "person_in_charge is not deleted"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/28/2023, 11:26:11 PM"
      }
    }
    ```

# Property.FacilityName

- Merupakan API data jenis fasilitas properti yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new facility name

- Description:

  - Berfungsi untuk menambahkan data `facilty_name` baru
  - Membutuhkan request body berupa `facility_name` dengan tipe data `string`

- ### URL
  - /property/facility_names/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    JSON
    ```

  - #### `Required input attribute`

  ```json
  {
    "facility_name": "Swimming Pool"
  }
  ```

- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_facility_names",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "facility_name": "facility_name must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Facility Name`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Facility Name` yang
    terdaftar di dalam database
- ### URL
  - /property/facility_names/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_facility_names",
        "attributes": [
          {
            "id": 1,
            "facility_name": "Swimming Pool",
            "created_at": "2023-05-03T08:45:45.000Z",
            "updated_at": "2023-05-03T08:45:45.000Z"
          },
          {
            "id": 2,
            "facility_name": "Gym",
            "created_at": "2023-05-03T08:45:54.000Z",
            "updated_at": "2023-05-03T08:45:54.000Z"
          },
          {
            "id": 3,
            "facility_name": "24 Hours Security",
            "created_at": "2023-05-03T08:50:04.000Z",
            "updated_at": "2023-05-03T08:50:04.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:20:31 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific facility name

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Facility Name` sesuai
    dengan `facility_name` yang diinginkan
  - Membutuhkan `query parameter` berupa `facility_name` dengan tipe data
    `string`. Contoh:
    `BASE_URL/property/facility_names/read?facility_name=Bedroom`
- ### URL
  - /property/facility_names/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_facility_names",
        "attributes": [
          {
            "id": 1,
            "facility_name": "Bedroom",
            "created_t": "2023-01-27T00:07:03.000Z",
            "updated_at": "2023-01-27T00:07:03.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:24:49 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "facility_name": "facility_name not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:25:02 PM"
      }
    }
    ```

## Get specific `Property Facility Name` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Facility Name` sesuai
    dengan `id` yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/facility_names/read/1`
- ### URL
  - /property/facility_names/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_facility_names",
        "attributes": {
          "id": 1,
          "facility_name": "Bedroom",
          "created_at": "2023-01-27T00:07:03.000Z",
          "updated_at": "2023-01-27T00:07:03.000Z"
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:27:47 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update facility name

- Description:
  - Berfungsi untuk mengubah data `facility_name` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/facility_names/update/1`
  - Perlu body request berupa `facility_name` baru yang akan mengubah data
    `Property Facility Name` yang sudah terdaftar
- ### URL
  - /property/facility_names/update/:id
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    JSON
    ```

  - #### Optional input attribute `
    ```json
    {
      "facility_name": "Swimming Pool"
    }
    ```

- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Facility Name` by id

- Description:
  - Berfungsi untuk menghapus satu data `Property Facility Name` sesuai dengan
    `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/facility_names/delete/1`
- ### URL
  - /property/facility_names/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Property Facility Name` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_facilities` yang mempunyai id `Property Facility Name` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# Property.PaymentTerm

- Merupakan API data jenis kesepakatan pembayaran apartemen yang terdaftar di
  database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new payment term

- Description:

  - Berfungsi untuk menambahkan data `payment_term` baru
  - Membutuhkan request body berupa `payment_term` dengan tipe data `string`

- ### URL
  - /property/payment_terms/create
- ### Method
  - POST
- ### Request Body Example
  ```json
  {
    "payment_term": "Full in Advance"
  }
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_payment_terms",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 3:13:39 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "payment_term": "payment_term must not be blank"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:09:16 PM"
      }
    }
    ```

## Get all `Property Payment Term`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Payment Term` yang
    terdaftar di dalam database
- ### URL
  - /property/payment_terms/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_payment_terms",
        "attributes": [
          {
            "id": 1,
            "payment_term": "Fully Advanced",
            "created_at": "2023-01-27T14:15:30.000Z",
            "updated_at": "2023-01-27T14:15:30.000Z"
          },
          {
            "id": 2,
            "payment_term": "Half in Advance",
            "created_at": "2023-01-27T15:17:07.000Z",
            "updated_at": "2023-01-27T15:17:07.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 11:17:15 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token has expired"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get specific payment term

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Property Payment Term` sesuai
    dengan `payment_term` yang diinginkan
  - Membutuhkan `query parameter` berupa `payment_term` dengan tipe data
    `string`. Contoh:
    `BASE_URL/property/payment_terms/read?payment_term=Full in Advance`
- ### URL
  - /property/payment_terms/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_payment_terms",
        "attributes": [
          {
            "id": 1,
            "payment_term": "Fully Advanced",
            "created_at": "2023-01-27T14:15:30.000Z",
            "updated_at": "2023-01-27T14:15:30.000Z"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:24:49 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "payment_term": "payment_term not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:25:02 PM"
      }
    }
    ```

## Get specific `Property Payment Term` by id

- Description:
  - Berfungsi untuk mengembalikan satu data `Property Payment Term` sesuai
    dengan `id` yang terdaftar
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/payment_terms/read/1`
- ### URL
  - /property/payment_terms/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response
  - Expected output:
    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_payment_terms",
        "attributes": {
          "id": 1,
          "payment_term": "Full in Advance",
          "created_at": "2023-01-27T14:15:30.000Z",
          "updated_at": "2023-01-27T14:15:30.000Z"
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/27/2023, 7:27:47 PM"
      }
    }
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Update apartment payment term

- Description:
  - Berfungsi untuk mengubah data `payment_term` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/payment_terms/update/1`
  - Perlu body request berupa `payment_term` baru yang akan mengubah data
    `Property Payment Term` yang sudah terdaftar
- ### URL
  - /property/payment_terms/update/:id
- ### Method
  - PUT
- ### Request Body Example
  ```json
  {
    "new_payment_term": "Full in Advance"
  }
  ```
- ### Response
  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Delete specific `Property Payment Term` by id

- Description:
  - Berfungsi untuk menghapus satu data `Property Payment Term` sesuai dengan
    `id` dari database
  - Membutuhkan `route parameter` berupa `id` dalam bentuk `integer`. Contoh:
    `BASE_URL/property/payment_terms/delete/1`
- ### URL
  - /property/payment_terms/delete/:id
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:
    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "id": "id must be an integer,id must not be null"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap `Property Paymment Term` berdasarkan `id`
        - Akan menghapus seluruh data `apartment_photos`, `apartment_facilities` dan `apartments` yang mempunyai id `Property Payment Term` yang sama dengan yang akan dihapus
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# Property.Apartment

- Merupakan API data apartemen-apartemen yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new `Apartement`

- Description:

  - Berfungsi untuk menambahkan data `Apartment` baru

- ### URL
  - /apartment/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    name: {
      type: string,
      pattern: /[^a-zA-Z0-9 ]+/
    };
    ```

    ```ts
    pic: {
      type: object,
      attributes: {
        "fullname": {
          type: string,
          required: true
        },
        "role": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "company": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "phone_number": {
          type: string,
          required: true,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        }
      }
    };
    ```

    ```ts
    property_area: string;
    ```

  - #### Optional input attribute `:` `Data type`

    - images
      - Untuk menambah foto baru `apartment` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - size
      ```ts
      size: number;
      ```
    - tower
      ```ts
      tower: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - floor
      ```ts
      floor: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - furnishing
      ```ts
      furnishing: string[("Fully Furnished", "Semi Furnished", "Unfurnished")];
      ```
    - bedroom
      ```ts
      bedroom: number;
      ```
    - bathroom
      ```ts
      bathroom: number;
      ```
    - study_room
      ```ts
      study_room: number;
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` bukan _null_, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          sell_price                  : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika `facilities` bukan _null_ maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen

- ### Response

  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "apartments",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get all `Apartment Kode Propar`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `kode_propar` dari `Apartment` yang terdaftar di
    dalam database
- ### URL
  - /apartment/read/kode_propar
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "apartments",
        "attributes": [
          {
            "kode_propar": "AMP001"
          },
          {
            "kode_propar": "AMP002"
          },
          {
            "kode_propar": "AMP003"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/7/2023, 11:24:30 AM"
      }
    }
    ```

## Get all `Apartment`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Apartment` yang terdaftar di
    dalam database
- ### URL
  - /apartment/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "apartments",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 2,
          "total_data_count": 2,
          "total_pages": 1,
          "records": [
            {
              "available": "No",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "KBYN001",
              "name": "Kebayoran Condo",
              "address": "Jl. Diponegoro, No. 10",
              "size": 500,
              "floor": "10",
              "tower": "2",
              "furnishing": "Fully Furnished",
              "bedroom": 2,
              "bathroom": 2,
              "study_room": 1,
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Unreachable",
              "remarks_2": "Plumbing issue",
              "remarks_3": "Has roof leaks",
              "created_at": "2023-05-03T08:47:58.000Z",
              "updated_at": "2023-05-03T10:29:14.000Z",
              "property_area": {
                "id": 1,
                "region_name": "Kebayoran"
              },
              "property_payment_term": {
                "id": 1,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Andi Muhammad Rezki",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Manager"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Company A"
                }
              },
              "facilities": [
                {
                  "id": 7,
                  "property_facility_name": {
                    "id": 5,
                    "facility_name": "Sauna"
                  }
                },
                {
                  "id": 6,
                  "property_facility_name": {
                    "id": 6,
                    "facility_name": "Football Field"
                  }
                }
              ],
              "photos": [
                {
                  "id": 16,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                },
                {
                  "id": 17,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_a mimir.jpg"
                },
                {
                  "id": 18,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_ayaya.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_ayaya.jpg"
                },
                {
                  "id": 19,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_cat.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-03-19-25-56_cat.jpg"
                },
                {
                  "id": 20,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-33_cat.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-33_cat.jpg"
                },
                {
                  "id": 21,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-48_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-48_a mimir.jpg"
                },
                {
                  "id": 22,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-56_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-56_a mimir.jpg"
                },
                {
                  "id": 23,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-58_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-54-58_a mimir.jpg"
                },
                {
                  "id": 24,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-55-00_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-55-00_a mimir.jpg"
                },
                {
                  "id": 25,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/KBYN-001/KBYN-001_2023-05-04-17-55-02_a mimir.jpg",
                  "photo_url": "/static/apartment/KBYN-001/KBYN-001_2023-05-04-17-55-02_a mimir.jpg"
                }
              ]
            },
            {
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "KBYN002",
              "name": "Kebayoran Apartment 3",
              "address": "Jl. Diponegoro, No. 10",
              "size": 200,
              "floor": "10",
              "tower": "2",
              "furnishing": "Fully Furnished",
              "bedroom": 2,
              "bathroom": 2,
              "study_room": 1,
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Unreachable",
              "remarks_2": "Plumbing issue",
              "remarks_3": "TBA",
              "created_at": "2023-05-06T05:50:39.000Z",
              "updated_at": "2023-05-06T05:50:39.000Z",
              "property_area": {
                "id": 1,
                "region_name": "Kebayoran"
              },
              "property_payment_term": {
                "id": 1,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Andi Muhammad Rezki",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Manager"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Company A"
                }
              },
              "facilities": [
                {
                  "id": 8,
                  "property_facility_name": {
                    "id": 1,
                    "facility_name": "Swimming Pool"
                  }
                },
                {
                  "id": 9,
                  "property_facility_name": {
                    "id": 2,
                    "facility_name": "Gym"
                  }
                }
              ],
              "photos": []
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "2/15/2023, 4:42:31 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```

  - #### Apartment

    - Kode Propar

      - Fungsi:
        - Untuk mencari apartement berdasarkan `kode_propar` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        kode_propar: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan kode propar `AMP001`
           ```txt
           BASE_URL/apartment/read?kode_propar=AMP001
           ```
        2. Mengurutkan apartment berdasarkan `kode_propar` secara `ascending`
           ```txt
           BASE_URL/apartment/read?kode_propar=ASC
           ```
        3. Mengurutkan apartment berdasarkan `kode_propar` secara `descending`
           ```txt
           BASE_URL/apartment/read?kode_propar=DESC
           ```

    - Name

      - Fungsi:
        - Untuk mencari apartement berdasarkan `nama` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        name: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan nama `Ampera Mansion`
           ```txt
           BASE_URL/apartment/read?name=Ampera%20Mansion
           ```
        2. Mengurutkan apartment berdasarkan `name` secara `ascending`
           ```txt
           BASE_URL/apartment/read?name=ASC
           ```
        3. Mengurutkan apartment berdasarkan `name` secara `descending`
           ```txt
           BASE_URL/apartment/read?name=DESC
           ```

    - Address

      - Fungsi:
        - Untuk mencari apartement berdasarkan `alamat` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        address: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan alamat `Jalan Tepo`
           ```txt
           BASE_URL/apartment/read?address=Jalan%20Tepo
           ```
        2. Mengurutkan apartment berdasarkan `address` secara `ascending`
           ```txt
           BASE_URL/apartment/read?address=ASC
           ```
        3. Mengurutkan apartment berdasarkan `address` secara `descending`
           ```txt
           BASE_URL/apartment/read?address=DESC
           ```

    - Size

      - Fungsi:
        - Untuk mencari apartement berdasarkan `size` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        apartment_size: string;
        size_from: number;
        size_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal size` berupa 200
           ```txt
           BASE_URL/apartment/read?size_from=200
           ```
        2. Mencari apartment dengan `size antara` 200 `hingga` 500
           ```txt
           BASE_URL/apartment/read?size_from=200&&size_to=500
           ```
        3. Mengurutkan apartment berdasarkan `size` secara `ascending`
           ```txt
           BASE_URL/apartment/read?apartment_size=ASC
           ```
        4. Mengurutkan apartment berdasarkan `size` secara `descending`
           ```txt
           BASE_URL/apartment/read?apartment_size=DESC
           ```

    - Tower

      - Fungsi:
        - Untuk mencari apartement berdasarkan `tower` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        tower: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan tower `3A`
           ```txt
           BASE_URL/apartment/read?tower=3A
           ```
        2. Mengurutkan apartment berdasarkan `tower` secara `ascending`
           ```txt
           BASE_URL/apartment/read?tower=ASC
           ```
        3. Mengurutkan apartment berdasarkan `tower` secara `descending`
           ```txt
           BASE_URL/apartment/read?tower=DESC
           ```

    - Floor

      - Fungsi:
        - Untuk mencari apartement berdasarkan `floor` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        floor: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan floor `10`
           ```txt
           BASE_URL/apartment/read?floor=10
           ```
        2. Mengurutkan apartment berdasarkan `floor` secara `ascending`
           ```txt
           BASE_URL/apartment/read?floor=ASC
           ```
        3. Mengurutkan apartment berdasarkan `floor` secara `descending`
           ```txt
           BASE_URL/apartment/read?floor=DESC
           ```

    - Furnishing

      - Fungsi:
        - Untuk mencari apartement berdasarkan `furnishing` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        furnishing: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan furnishing `Fully Furnished`
           ```txt
           BASE_URL/apartment/read?furnishing=Fully%20Furnished
           ```
        2. Mengurutkan apartment berdasarkan `furnishing` secara `ascending`
           ```txt
           BASE_URL/apartment/read?furnishing=ASC
           ```
        3. Mengurutkan apartment berdasarkan `furnishing` secara `descending`
           ```txt
           BASE_URL/apartment/read?furnishing=DESC
           ```

    - Available

      - Fungsi:
        - Untuk mencari apartement berdasarkan `available` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        available: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan available `Yes`
           ```txt
           BASE_URL/apartment/read?available=Yes
           ```
        2. Mencari apartment dengan available `No`
           ```txt
           BASE_URL/apartment/read?available=No
           ```
        3. Mengurutkan apartment berdasarkan `available` secara `ascending`
           ```txt
           BASE_URL/apartment/read?available=ASC
           ```
        4. Mengurutkan apartment berdasarkan `available` secara `descending`
           ```txt
           BASE_URL/apartment/read?available=DESC
           ```

    - Bedroom

      - Fungsi:
        - Untuk mencari apartement berdasarkan `bedroom` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        bedroom_from: number;
        bedroom_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal bedroom` berupa 35000000
           ```txt
           BASE_URL/apartment/read?bedroom_from=35000000
           ```
        2. Mencari apartment dengan `bedroom antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?bedroom_from=35000000&&bedroom_to=12000000000
           ```

    - Bathroom

      - Fungsi:
        - Untuk mencari apartement berdasarkan `bathroom` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        bathroom_from: number;
        bathroom_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal bathroom` berupa 35000000
           ```txt
           BASE_URL/apartment/read?bathroom_from=35000000
           ```
        2. Mencari apartment dengan `bathroom antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?bathroom_from=35000000&&bathroom_to=12000000000
           ```

    - Study Room

      - Fungsi:
        - Untuk mencari apartement berdasarkan `study_room` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        study_room_from: number;
        study_room_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal study room` berupa 35000000
           ```txt
           BASE_URL/apartment/read?study_room_from=35000000
           ```
        2. Mencari apartment dengan `study room antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?study_room_from=35000000&&study_room_to=12000000000
           ```

    - Created At

      - Fungsi:
        - Untuk mencari apartement berdasarkan `created_at` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        created_at: string;
        ```

      - Contoh request:
        1. Mengurutkan apartment berdasarkan `created_at` secara `ascending`
           ```txt
           BASE_URL/apartment/read?created_at=ASC
           ```
        2. Mengurutkan apartment berdasarkan `created_at` secara `descending`
           ```txt
           BASE_URL/apartment/read?created_at=DESC
           ```

    - Updated At

      - Fungsi:
        - Untuk mencari apartement berdasarkan `updated_at` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        updated_at: string;
        ```

      - Contoh request:
        1. Mengurutkan apartment berdasarkan `updated_at` secara `ascending`
           ```txt
           BASE_URL/apartment/read?updated_at=ASC
           ```
        2. Mengurutkan apartment berdasarkan `updated_at` secara `descending`
           ```txt
           BASE_URL/apartment/read?updated_at=DESC
           ```

  - #### Apartment Facility

    - Facility Name

      - Fungsi:
        - Untuk mencari apartement berdasarkan `property_facility_name` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        facility_name: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan facility_name `Bedroom`
           ```txt
           BASE_URL/apartment/read?facility_name=Bedroom
           ```

  - #### Property Area

    - Area

      - Fungsi:
        - Untuk mencari apartement berdasarkan `property_area` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        area: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan area `Bekasi`
           ```txt
           BASE_URL/apartment/read?area=Bekasi
           ```

  - #### Apartment Fee

    - Rental Price

      - Fungsi:
        - Untuk mencari apartement berdasarkan `rental_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        rental_price: string;
        rental_price_from: number;
        rental_price_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal rental price` berupa 35000000
           ```txt
           BASE_URL/apartment/read?rental_price_from=35000000
           ```
        2. Mencari apartment dengan `rental price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?rental_price_from=35000000&&rental_price_to=12000000000
           ```
        3. Mengurutkan apartment berdasarkan `rental_price` secara `ascending`
           ```txt
           BASE_URL/apartment/read?rental_price=ASC
           ```
        4. Mengurutkan apartment berdasarkan `rental_price` secara `descending`
           ```txt
           BASE_URL/apartment/read?rental_price=DESC
           ```

    - Selling Price

      - Fungsi:
        - Untuk mencari apartement berdasarkan `selling_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        selling_price: string;
        selling_price_from: number;
        selling_price_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal selling price` berupa 35000000
           ```txt
           BASE_URL/apartment/read?selling_price_from=35000000
           ```
        2. Mencari apartment dengan `selling price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?selling_price_from=35000000&&selling_price_to=12000000000
           ```
        3. Mengurutkan apartment berdasarkan `selling_price` secara `ascending`
           ```txt
           BASE_URL/apartment/read?selling_price=ASC
           ```
        4. Mengurutkan apartment berdasarkan `selling_price` secara `descending`
           ```txt
           BASE_URL/apartment/read?selling_price=DESC
           ```

    - Lease Term Time

      - Fungsi:
        - Untuk mencari apartement berdasarkan `lease_term_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_time: string;
        lease_term_time_from: number;
        lease_term_time_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/apartment/read?lease_term_time_from=35000000
           ```
        2. Mencari apartment dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?lease_term_time_from=35000000&&lease_term_time_to=12000000000
           ```
        3. Mengurutkan apartment berdasarkan `lease_term_time` secara `ascending`
           ```txt
           BASE_URL/apartment/read?lease_term_time=ASC
           ```
        4. Mengurutkan apartment berdasarkan `lease_term_time` secara `descending`
           ```txt
           BASE_URL/apartment/read?lease_term_time=DESC
           ```

    - Lease Term Type

      - Fungsi:
        - Untuk mencari apartement berdasarkan `lease_term_type` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_type: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan lease_term_type `Month`
           ```txt
           BASE_URL/apartment/read?lease_term_type=Month
           ```
        2. Mencari apartment dengan lease_term_type `Year`
           ```txt
           BASE_URL/apartment/read?lease_term_type=Year
           ```

    - Price Currency

      - Fungsi:
        - Untuk mencari apartement berdasarkan `price_currency` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        price_currency: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan price_currency `Rupiah`
           ```txt
           BASE_URL/apartment/read?price_currency=Rupiah
           ```
        2. Mencari apartment dengan price_currency `US Dollar`
           ```txt
           BASE_URL/apartment/read?price_currency=US%20Dollar
           ```

    - Payment Term

      - Fungsi:
        - Untuk mencari apartement berdasarkan `payment_term` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        payment_term: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan payment_term `Full in Advance`
           ```txt
           BASE_URL/apartment/read?payment_term=Full%20in%20Advance
           ```

  - #### Apartment Tax Fee

    - VAT is Included

      - Fungsi:
        - Untuk mencari apartement berdasarkan `vat_is_included` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_is_included: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan vat_is_included `Yes`
           ```txt
           BASE_URL/apartment/read?vat_is_included=Yes
           ```
        2. Mencari apartment dengan vat_is_included `No`
           ```txt
           BASE_URL/apartment/read?vat_is_included=No
           ```
        3. Mengurutkan apartment berdasarkan `vat_is_included` secara `ascending`
           ```txt
           BASE_URL/apartment/read?vat_is_included=ASC
           ```
        4. Mengurutkan apartment berdasarkan `vat_is_included` secara `descending`
           ```txt
           BASE_URL/apartment/read?vat_is_included=DESC
           ```

    - VAT Percentage

      - Fungsi:
        - Untuk mencari apartement berdasarkan `vat_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_percentage: string;
        vat_percentage_from: number;
        vat_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal vat percentage` berupa 35000000
           ```txt
           BASE_URL/apartment/read?vat_percentage_from=35000000
           ```
        2. Mencari apartment dengan `vat percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?vat_percentage_from=35000000&&vat_percentage_to=12000000000
           ```
        3. Mengurutkan apartment berdasarkan `vat_percentage` secara `ascending`
           ```txt
           BASE_URL/apartment/read?vat_percentage=ASC
           ```
        4. Mengurutkan apartment berdasarkan `vat_percentage` secara `descending`
           ```txt
           BASE_URL/apartment/read?vat_percentage=DESC
           ```

    - WHT is Included

      - Fungsi:
        - Untuk mencari apartement berdasarkan `wht_is_included` apartment tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_is_included: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan wht_is_included `Yes`
           ```txt
           BASE_URL/apartment/read?wht_is_included=Yes
           ```
        2. Mencari apartment dengan wht_is_included `No`
           ```txt
           BASE_URL/apartment/read?wht_is_included=No
           ```
        3. Mengurutkan apartment berdasarkan `wht_is_included` secara `ascending`
           ```txt
           BASE_URL/apartment/read?wht_is_included=ASC
           ```
        4. Mengurutkan apartment berdasarkan `wht_is_included` secara `descending`
           ```txt
           BASE_URL/apartment/read?wht_is_included=DESC
           ```

    - WHT Percentage

      - Fungsi:
        - Untuk mencari apartement berdasarkan `wht_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_percentage: string;
        wht_percentage_from: number;
        wht_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari apartment dengan `minimal wht percentage` berupa 35000000
           ```txt
           BASE_URL/apartment/read?wht_percentage_from=35000000
           ```
        2. Mencari apartment dengan `wht percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/apartment/read?wht_percentage_from=35000000&&wht_percentage_to=12000000000
           ```
        3. Mengurutkan apartment berdasarkan `wht_percentage` secara `ascending`
           ```txt
           BASE_URL/apartment/read?wht_percentage=ASC
           ```
        4. Mengurutkan apartment berdasarkan `wht_percentage` secara `descending`
           ```txt
           BASE_URL/apartment/read?wht_percentage=DESC
           ```

  - #### Property Person in Charge

    - Fullname

      - Fungsi:
        - Untuk mencari apartement berdasarkan `fullname` tertentu dari `property_person_in_charges`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        pic_fullname: string;
        ```

      - Contoh request:
        1. Mencari apartment dengan pic_fullname `Andi Rezki Muhammad`
           ```txt
           BASE_URL/apartment/read?pic_fullname=Andi%20Rezki%20Muhammad
           ```

## Update or Create an `Apartment`

- Description:

  - Berfungsi untuk mengubah data `apartment` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/apartment/update/AMP-001`
  - Akan membuat data baru secara otomatis sesuai dengan `kode_propar` apabila data yang ingin di update belum ada

- ### URL
  - /apartment/update/:kode_propar
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### Optional input attribute `:` `Data type`

    - kode_propar
      ```ts
      kode_propar: {
        type: string,
        pattern: /^[A-Z]{1,7}[0-9]{3}$/
      };
      ```
    - name
      <br />Untuk mengubah `name` dari `apartment`
      ```ts
      name: {
        type: string,
        pattern: /[^a-zA-Z0-9 ]+/,
      };
      ```
    - pic
      <br />Untuk mengubah `person_in_charge` dari `apartment`

      ```ts
      pic: object || null;
      ```

      - Jika `pic` tidak kosong, maka berikut adalah `field` yang **HARUS** diubah:
        ```ts
        {
          fullname     : {
            type     : string,
            required : true
          },
          role         : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          company      : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          phone_number : {
            type     : string,
            required : true,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
        }
        ```

    - property_area
      <br />Untuk mengubah `area` dari `apartment`
      ```ts
      property_area: string;
      ```
    - images
      - Untuk menambah foto baru `apartment` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - size
      ```ts
      size: number;
      ```
    - tower
      ```ts
      tower: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - floor
      ```ts
      floor: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - furnishing
      ```ts
      furnishing: string[("Fully Furnished", "Semi Furnished", "Unfurnished")];
      ```
    - bedroom
      ```ts
      bedroom: number;
      ```
    - bathroom
      ```ts
      bathroom: number;
      ```
    - study_room
      ```ts
      study_room: number;
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` tidak kosong, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          sell_price                  : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika ingin mengubah/membuat data pada `apartment_facilities` , maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `array kosong` jika **HANYA INGIN MENGHAPUS** semua data fasilitas apartemen berdasarkan `kode_propar`
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen
      - ketika mengubah/menambah data pada `apartment_facilities`, API akan menghapus seluruh data fasilitas apartemen secara otomatis sebelum memasukkan data input dari pengguna

    - deleted_photo_ids

      - Untuk menghapus foto `apartment` berdasarkan `id`
      - Berikan nilai `true` pada `force_delete` jika ingin melakukan hard delete pada foto
      - Sebaliknya jika ingin melakukan soft delete, berikan nilai `false` pada `force_delete`

      ```ts
      deleted_photo_ids: object[] || null;
      ```

      - Jika `deleted_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:

        ```ts
        {
          id            : number,
          force_delete  : boolean
        }
        ```

    - restored_photo_ids

      - Untuk mengembalikan foto `apartment` yang di soft delete berdasarkan `id` foto di tabel `apartment_photos`

      ```ts
      restored_photo_ids: object[] || null;
      ```

      - Jika `restored_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          id: number;
        }
        ```

- ### Response

  - Expected output:

    ```txt
    Return 204 No Content and Empty Body Response
    ```

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "size": "size must be integer"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Delete specific `Apartment` by kode_propar

- Description:
  - Berfungsi untuk menghapus satu data `Apartment` sesuai dengan `kode_propar`
    dari database
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/apartment/delete/AMP-001`
- ### URL
  - /apartment/delete/:kode_propar
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "kode_propar": "kode_propar not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap apartment berdasarkan `kode_propar`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

## Restore specific `Apartment` by kode_propar

- Description:
  - Berfungsi untuk mengembalikan satu data `Apartment` yang sudah terhapus
    `(soft-delete)` sesuai dengan `kode_propar` dari database
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/apartment/restore/AMP-001`
- ### URL
  - /apartment/restore/:kode_propar
- ### Method
  - PUT
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "apartments",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "kode_propar": "kode_propar not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

# Property.Home

- Merupakan API data home yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new `Home`

- Description:

  - Berfungsi untuk menambahkan data `Home` baru

- ### URL
  - /home/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    name: {
      type: string,
      pattern: /[^a-zA-Z0-9 ]+/
    };
    ```

    ```ts
    pic: {
      type: object,
      attributes: {
        "fullname": {
          type: string,
          required: true
        },
        "role": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "company": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "phone_number": {
          type: string,
          required: true,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        }
      }
    };
    ```

    ```ts
    property_area: string;
    ```

  - #### Optional input attribute `:` `Data type`

    - images
      - Untuk menambah foto baru `home` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - land_size
      ```ts
      land_size: number;
      ```
    - building_size
      ```ts
      building_size: number;
      ```
    - stories
      ```ts
      stories: number;
      ```
    - furnishing
      ```ts
      furnishing: string[("Fully Furnished", "Semi Furnished", "Unfurnished")];
      ```
    - bedroom
      ```ts
      bedroom: number;
      ```
    - bathroom
      ```ts
      bathroom: number;
      ```
    - study_room
      ```ts
      study_room: number;
      ```
    - carport_or_garage
      ```ts
      carport_or_garage: number;
      ```
    - backyard
      ```ts
      backyard: boolean;
      ```
    - swimming_pool
      ```ts
      swimming_pool: boolean;
      ```
    - house_type
      ```ts
      house_type: string[("Standalone", "Compound")];
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` bukan _null_, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          selling_price               : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean,
          compound_fee                : number,
          compound_fee_coverage       : string
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika `facilities` bukan _null_ maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen

- ### Response

  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "homes",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get all `Home Kode Propar`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `kode_propar` dari `Home` yang terdaftar di
    dalam database
- ### URL
  - /home/read/kode_propar
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "homes",
        "attributes": [
          {
            "kode_propar": "AMP001"
          },
          {
            "kode_propar": "AMP002"
          },
          {
            "kode_propar": "AMP003"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/7/2023, 11:24:30 AM"
      }
    }
    ```

## Get all `Home`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Home` yang terdaftar di
    dalam database
- ### URL
  - /home/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "homes",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 4,
          "total_data_count": 4,
          "total_pages": 1,
          "records": [
            {
              "backyard": "Yes",
              "swimming_pool": "Yes",
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP001",
              "name": "Ampera House 001",
              "address": "Jl. Diponegoro, No. 10",
              "land_size": 500,
              "building_size": 300,
              "stories": 3,
              "furnishing": "Fully Furnished",
              "bedroom": 5,
              "bathroom": 6,
              "study_room": 2,
              "carport_or_garage": 1,
              "house_type": "Standalone",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "compound_fee": 0,
              "compound_fee_coverage": null,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-06-11T01:14:18.000Z",
              "updated_at": "2023-06-11T01:14:18.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Bekasi"
              },
              "property_payment_term": {
                "id": 2,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Kapten"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Tim Gerbang Selatan"
                }
              },
              "facilities": [
                {
                  "id": 3,
                  "property_facility_name": {
                    "id": 3,
                    "facility_name": "Waterpark"
                  }
                },
                {
                  "id": 4,
                  "property_facility_name": {
                    "id": 4,
                    "facility_name": "Basketball Field"
                  }
                }
              ],
              "photos": [
                {
                  "id": 1,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP001/AMP001_2023-06-10-09-14-17_cat.jpg",
                  "photo_url": "/static/home/AMP001/AMP001_2023-06-10-09-14-17_cat.jpg"
                },
                {
                  "id": 2,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP001/AMP001_2023-06-10-09-14-17_kucing.jpg",
                  "photo_url": "/static/home/AMP001/AMP001_2023-06-10-09-14-17_kucing.jpg"
                }
              ]
            },
            {
              "backyard": "Yes",
              "swimming_pool": "Yes",
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP002",
              "name": "Ampera House 002",
              "address": "Jl. Diponegoro, No. 10",
              "land_size": 500,
              "building_size": 300,
              "stories": 3,
              "furnishing": "Fully Furnished",
              "bedroom": 5,
              "bathroom": 6,
              "study_room": 2,
              "carport_or_garage": 1,
              "house_type": "Standalone",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "compound_fee": 0,
              "compound_fee_coverage": null,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-06-10T09:16:55.000Z",
              "updated_at": "2023-06-10T09:16:55.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Bekasi"
              },
              "property_payment_term": {
                "id": 2,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Kapten"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Tim Gerbang Selatan"
                }
              },
              "facilities": [],
              "photos": [
                {
                  "id": 3,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP002/AMP002_2023-06-10-09-16-52_cat.jpg",
                  "photo_url": "/static/home/AMP002/AMP002_2023-06-10-09-16-52_cat.jpg"
                },
                {
                  "id": 4,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP002/AMP002_2023-06-10-09-16-52_kucing.jpg",
                  "photo_url": "/static/home/AMP002/AMP002_2023-06-10-09-16-52_kucing.jpg"
                }
              ]
            },
            {
              "backyard": "Yes",
              "swimming_pool": "Yes",
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP003",
              "name": "Ampera House 003",
              "address": "Jl. Diponegoro, No. 10",
              "land_size": 500,
              "building_size": 300,
              "stories": 3,
              "furnishing": "Fully Furnished",
              "bedroom": 5,
              "bathroom": 6,
              "study_room": 2,
              "carport_or_garage": 1,
              "house_type": "Standalone",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "compound_fee": 0,
              "compound_fee_coverage": null,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-06-10T01:22:33.000Z",
              "updated_at": "2023-06-10T01:22:33.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Bekasi"
              },
              "property_payment_term": {
                "id": 2,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Kapten"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Tim Gerbang Selatan"
                }
              },
              "facilities": [],
              "photos": [
                {
                  "id": 5,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP003/AMP003_2023-06-10-09-22-32_cat.jpg",
                  "photo_url": "/static/home/AMP003/AMP003_2023-06-10-09-22-32_cat.jpg"
                },
                {
                  "id": 6,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP003/AMP003_2023-06-10-09-22-32_kucing.jpg",
                  "photo_url": "/static/home/AMP003/AMP003_2023-06-10-09-22-32_kucing.jpg"
                }
              ]
            },
            {
              "backyard": "Yes",
              "swimming_pool": "Yes",
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP004",
              "name": "Ampera House 004",
              "address": "Jl. Diponegoro, No. 10",
              "land_size": 500,
              "building_size": 300,
              "stories": 3,
              "furnishing": "Fully Furnished",
              "bedroom": 5,
              "bathroom": 6,
              "study_room": 2,
              "carport_or_garage": 1,
              "house_type": "Standalone",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "compound_fee": 0,
              "compound_fee_coverage": null,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-06-10T01:41:39.000Z",
              "updated_at": "2023-06-10T01:41:39.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Bekasi"
              },
              "property_payment_term": {
                "id": 2,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Kapten"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Tim Gerbang Selatan"
                }
              },
              "facilities": [
                {
                  "id": 1,
                  "property_facility_name": {
                    "id": 3,
                    "facility_name": "Waterpark"
                  }
                },
                {
                  "id": 2,
                  "property_facility_name": {
                    "id": 4,
                    "facility_name": "Basketball Field"
                  }
                }
              ],
              "photos": [
                {
                  "id": 7,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP004/AMP004_2023-06-10-09-41-37_cat.jpg",
                  "photo_url": "/static/home/AMP004/AMP004_2023-06-10-09-41-37_cat.jpg"
                },
                {
                  "id": 8,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/home/AMP004/AMP004_2023-06-10-09-41-37_kucing.jpg",
                  "photo_url": "/static/home/AMP004/AMP004_2023-06-10-09-41-37_kucing.jpg"
                }
              ]
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/30/2023, 11:16:27 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```

  - #### Home

    - Kode Propar

      - Fungsi:
        - Untuk mencari home berdasarkan `kode_propar` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        kode_propar: string;
        ```

      - Contoh request:
        1. Mencari home dengan kode propar `AMP001`
           ```txt
           BASE_URL/home/read?kode_propar=AMP001
           ```
        2. Mengurutkan home berdasarkan `kode_propar` secara `ascending`
           ```txt
           BASE_URL/home/read?kode_propar=ASC
           ```
        3. Mengurutkan home berdasarkan `kode_propar` secara `descending`
           ```txt
           BASE_URL/home/read?kode_propar=DESC
           ```

    - Name

      - Fungsi:
        - Untuk mencari home berdasarkan `nama` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        name: string;
        ```

      - Contoh request:
        1. Mencari home dengan nama `Ampera Mansion`
           ```txt
           BASE_URL/home/read?name=Ampera%20Mansion
           ```
        2. Mengurutkan home berdasarkan `name` secara `ascending`
           ```txt
           BASE_URL/home/read?name=ASC
           ```
        3. Mengurutkan home berdasarkan `name` secara `descending`
           ```txt
           BASE_URL/home/read?name=DESC
           ```

    - Address

      - Fungsi:
        - Untuk mencari home berdasarkan `alamat` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        address: string;
        ```

      - Contoh request:
        1. Mencari home dengan alamat `Jalan Tepo`
           ```txt
           BASE_URL/home/read?address=Jalan%20Tepo
           ```
        2. Mengurutkan home berdasarkan `address` secara `ascending`
           ```txt
           BASE_URL/home/read?address=ASC
           ```
        3. Mengurutkan home berdasarkan `address` secara `descending`
           ```txt
           BASE_URL/home/read?address=DESC
           ```

    - Land Size

      - Fungsi:
        - Untuk mencari home berdasarkan `land_size` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        land_size: string;
        land_size_from: number;
        land_size_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal land_size` berupa 200
           ```txt
           BASE_URL/home/read?land_size_from=200
           ```
        2. Mencari home dengan `land_size antara` 200 `hingga` 500
           ```txt
           BASE_URL/home/read?land_size_from=200&&land_size_to=500
           ```
        3. Mengurutkan home berdasarkan `land_size` secara `ascending`
           ```txt
           BASE_URL/home/read?land_size=ASC
           ```
        4. Mengurutkan home berdasarkan `land_size` secara `descending`
           ```txt
           BASE_URL/home/read?land_size=DESC
           ```

    - Building Size

      - Fungsi:
        - Untuk mencari home berdasarkan `building_size` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        building_size: string;
        building_size_from: number;
        building_size_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal building_size` berupa 200
           ```txt
           BASE_URL/home/read?building_size_from=200
           ```
        2. Mencari home dengan `building_size antara` 200 `hingga` 500
           ```txt
           BASE_URL/home/read?building_size_from=200&&building_size_to=500
           ```
        3. Mengurutkan home berdasarkan `building_size` secara `ascending`
           ```txt
           BASE_URL/home/read?building_size=ASC
           ```
        4. Mengurutkan home berdasarkan `building_size` secara `descending`
           ```txt
           BASE_URL/home/read?building_size=DESC
           ```

    - Stories

      - Fungsi:
        - Untuk mencari home berdasarkan `stories` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        stories: string;
        stories_from: number;
        stories_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal stories` berupa 200
           ```txt
           BASE_URL/home/read?stories_from=200
           ```
        2. Mencari home dengan `stories antara` 200 `hingga` 500
           ```txt
           BASE_URL/home/read?stories_from=200&&stories_to=500
           ```
        3. Mengurutkan home berdasarkan `stories` secara `ascending`
           ```txt
           BASE_URL/home/read?stories=ASC
           ```
        4. Mengurutkan home berdasarkan `stories` secara `descending`
           ```txt
           BASE_URL/home/read?stories=DESC
           ```

    - Furnishing

      - Fungsi:
        - Untuk mencari home berdasarkan `furnishing` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        furnishing: string;
        ```

      - Contoh request:
        1. Mencari home dengan furnishing `Fully Furnished`
           ```txt
           BASE_URL/home/read?furnishing=Fully%20Furnished
           ```
        2. Mengurutkan home berdasarkan `furnishing` secara `ascending`
           ```txt
           BASE_URL/home/read?furnishing=ASC
           ```
        3. Mengurutkan home berdasarkan `furnishing` secara `descending`
           ```txt
           BASE_URL/home/read?furnishing=DESC
           ```

    - House Type

      - Fungsi:
        - Untuk mencari home berdasarkan `house_type` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        house_type: string;
        ```

      - Contoh request:
        1. Mencari home dengan house_type `Compound`
           ```txt
           BASE_URL/home/read?house_type=Compound
           ```
        2. Mengurutkan home berdasarkan `house_type` secara `ascending`
           ```txt
           BASE_URL/home/read?house_type=ASC
           ```
        3. Mengurutkan home berdasarkan `house_type` secara `descending`
           ```txt
           BASE_URL/home/read?house_type=DESC
           ```

    - Available

      - Fungsi:
        - Untuk mencari home berdasarkan `available` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        available: string;
        ```

      - Contoh request:
        1. Mencari home dengan available `Yes`
           ```txt
           BASE_URL/home/read?available=Yes
           ```
        2. Mencari home dengan available `No`
           ```txt
           BASE_URL/home/read?available=No
           ```
        3. Mengurutkan home berdasarkan `available` secara `ascending`
           ```txt
           BASE_URL/home/read?available=ASC
           ```
        4. Mengurutkan home berdasarkan `available` secara `descending`
           ```txt
           BASE_URL/home/read?available=DESC
           ```

    - Backyard

      - Fungsi:
        - Untuk mencari home berdasarkan `backyard` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        backyard: string;
        ```

      - Contoh request:
        1. Mencari home dengan backyard `Yes`
           ```txt
           BASE_URL/home/read?backyard=Yes
           ```
        2. Mencari home dengan backyard `No`
           ```txt
           BASE_URL/home/read?backyard=No
           ```
        3. Mengurutkan home berdasarkan `backyard` secara `ascending`
           ```txt
           BASE_URL/home/read?backyard=ASC
           ```
        4. Mengurutkan home berdasarkan `backyard` secara `descending`
           ```txt
           BASE_URL/home/read?backyard=DESC
           ```

    - Swimming Pool

      - Fungsi:
        - Untuk mencari home berdasarkan `swimming_pool` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        swimming_pool: string;
        ```

      - Contoh request:
        1. Mencari home dengan swimming_pool `Yes`
           ```txt
           BASE_URL/home/read?swimming_pool=Yes
           ```
        2. Mencari home dengan swimming_pool `No`
           ```txt
           BASE_URL/home/read?swimming_pool=No
           ```
        3. Mengurutkan home berdasarkan `swimming_pool` secara `ascending`
           ```txt
           BASE_URL/home/read?swimming_pool=ASC
           ```
        4. Mengurutkan home berdasarkan `swimming_pool` secara `descending`
           ```txt
           BASE_URL/home/read?swimming_pool=DESC
           ```

    - Bedroom

      - Fungsi:
        - Untuk mencari home berdasarkan `bedroom` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        bedroom_from: number;
        bedroom_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal bedroom` berupa 35000000
           ```txt
           BASE_URL/home/read?bedroom_from=35000000
           ```
        2. Mencari home dengan `bedroom antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?bedroom_from=35000000&&bedroom_to=12000000000
           ```

    - Bathroom

      - Fungsi:
        - Untuk mencari home berdasarkan `bathroom` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        bathroom_from: number;
        bathroom_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal bathroom` berupa 35000000
           ```txt
           BASE_URL/home/read?bathroom_from=35000000
           ```
        2. Mencari home dengan `bathroom antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?bathroom_from=35000000&&bathroom_to=12000000000
           ```

    - Study Room

      - Fungsi:
        - Untuk mencari home berdasarkan `study_room` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        study_room_from: number;
        study_room_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal study_room` berupa 35000000
           ```txt
           BASE_URL/home/read?study_room_from=35000000
           ```
        2. Mencari home dengan `study_room antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?study_room_from=35000000&&study_room_to=12000000000
           ```

    - Carport or Garage

      - Fungsi:
        - Untuk mencari home berdasarkan `carport_or_garage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        carport_or_garage_from: number;
        carport_or_garage_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal carport_or_garage` berupa 35000000
           ```txt
           BASE_URL/home/read?carport_or_garage_from=35000000
           ```
        2. Mencari home dengan `carport_or_garage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?carport_or_garage_from=35000000&&carport_or_garage_to=12000000000
           ```

    - Created At

      - Fungsi:
        - Untuk mencari home berdasarkan `created_at` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        created_at: string;
        ```

      - Contoh request:
        1. Mengurutkan home berdasarkan `created_at` secara `ascending`
           ```txt
           BASE_URL/home/read?created_at=ASC
           ```
        2. Mengurutkan home berdasarkan `created_at` secara `descending`
           ```txt
           BASE_URL/home/read?created_at=DESC
           ```

    - Updated At

      - Fungsi:
        - Untuk mencari home berdasarkan `updated_at` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        updated_at: string;
        ```

      - Contoh request:
        1. Mengurutkan home berdasarkan `updated_at` secara `ascending`
           ```txt
           BASE_URL/home/read?updated_at=ASC
           ```
        2. Mengurutkan home berdasarkan `updated_at` secara `descending`
           ```txt
           BASE_URL/home/read?updated_at=DESC
           ```

  - #### Home Facility

    - Facility Name

      - Fungsi:
        - Untuk mencari home berdasarkan `property_facility_name` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        facility_name: string;
        ```

      - Contoh request:
        1. Mencari home dengan facility_name `Bedroom`
           ```txt
           BASE_URL/home/read?facility_name=Bedroom
           ```

  - #### Property Area

    - Area

      - Fungsi:
        - Untuk mencari home berdasarkan `property_area` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        area: string;
        ```

      - Contoh request:
        1. Mencari home dengan area `Bekasi`
           ```txt
           BASE_URL/home/read?area=Bekasi
           ```

  - #### Home Fee

    - Rental Price

      - Fungsi:
        - Untuk mencari home berdasarkan `rental_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        rental_price: string;
        rental_price_from: number;
        rental_price_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal rental price` berupa 35000000
           ```txt
           BASE_URL/home/read?rental_price_from=35000000
           ```
        2. Mencari home dengan `rental price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?rental_price_from=35000000&&rental_price_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `rental_price` secara `ascending`
           ```txt
           BASE_URL/home/read?rental_price=ASC
           ```
        4. Mengurutkan home berdasarkan `rental_price` secara `descending`
           ```txt
           BASE_URL/home/read?rental_price=DESC
           ```

    - Selling Price

      - Fungsi:
        - Untuk mencari home berdasarkan `selling_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        selling_price: string;
        selling_price_from: number;
        selling_price_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal selling price` berupa 35000000
           ```txt
           BASE_URL/home/read?selling_price_from=35000000
           ```
        2. Mencari home dengan `selling price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?selling_price_from=35000000&&selling_price_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `selling_price` secara `ascending`
           ```txt
           BASE_URL/home/read?selling_price=ASC
           ```
        4. Mengurutkan home berdasarkan `selling_price` secara `descending`
           ```txt
           BASE_URL/home/read?selling_price=DESC
           ```

    - Compound Fee

      - Fungsi:
        - Untuk mencari home berdasarkan `compound_fee` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        compound_fee: string;
        compound_fee_from: number;
        compound_fee_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/home/read?compound_fee_from=35000000
           ```
        2. Mencari home dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?compound_fee_from=35000000&&compound_fee_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `compound_fee` secara `ascending`
           ```txt
           BASE_URL/home/read?compound_fee=ASC
           ```
        4. Mengurutkan home berdasarkan `compound_fee` secara `descending`
           ```txt
           BASE_URL/home/read?compound_fee=DESC
           ```

    - Lease Term Time

      - Fungsi:
        - Untuk mencari home berdasarkan `lease_term_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_time: string;
        lease_term_time_from: number;
        lease_term_time_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/home/read?lease_term_time_from=35000000
           ```
        2. Mencari home dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?lease_term_time_from=35000000&&lease_term_time_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `lease_term_time` secara `ascending`
           ```txt
           BASE_URL/home/read?lease_term_time=ASC
           ```
        4. Mengurutkan home berdasarkan `lease_term_time` secara `descending`
           ```txt
           BASE_URL/home/read?lease_term_time=DESC
           ```

    - Lease Term Type

      - Fungsi:
        - Untuk mencari home berdasarkan `lease_term_type` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_type: string;
        ```

      - Contoh request:
        1. Mencari home dengan lease_term_type `Month`
           ```txt
           BASE_URL/home/read?lease_term_type=Month
           ```
        2. Mencari home dengan lease_term_type `Year`
           ```txt
           BASE_URL/home/read?lease_term_type=Year
           ```

    - Price Currency

      - Fungsi:
        - Untuk mencari home berdasarkan `price_currency` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        price_currency: string;
        ```

      - Contoh request:
        1. Mencari home dengan price_currency `Rupiah`
           ```txt
           BASE_URL/home/read?price_currency=Rupiah
           ```
        2. Mencari home dengan price_currency `US Dollar`
           ```txt
           BASE_URL/home/read?price_currency=US%20Dollar
           ```

    - Payment Term

      - Fungsi:
        - Untuk mencari home berdasarkan `payment_term` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        payment_term: string;
        ```

      - Contoh request:
        1. Mencari home dengan payment_term `Full in Advance`
           ```txt
           BASE_URL/home/read?payment_term=Full%20in%20Advance
           ```

  - #### Home Tax Fee

    - VAT is Included

      - Fungsi:
        - Untuk mencari home berdasarkan `vat_is_included` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_is_included: string;
        ```

      - Contoh request:
        1. Mencari home dengan vat_is_included `Yes`
           ```txt
           BASE_URL/home/read?vat_is_included=Yes
           ```
        2. Mencari home dengan vat_is_included `No`
           ```txt
           BASE_URL/home/read?vat_is_included=No
           ```
        3. Mengurutkan home berdasarkan `vat_is_included` secara `ascending`
           ```txt
           BASE_URL/home/read?vat_is_included=ASC
           ```
        4. Mengurutkan home berdasarkan `vat_is_included` secara `descending`
           ```txt
           BASE_URL/home/read?vat_is_included=DESC
           ```

    - VAT Percentage

      - Fungsi:
        - Untuk mencari home berdasarkan `vat_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_percentage: string;
        vat_percentage_from: number;
        vat_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal vat percentage` berupa 35000000
           ```txt
           BASE_URL/home/read?vat_percentage_from=35000000
           ```
        2. Mencari home dengan `vat percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?vat_percentage_from=35000000&&vat_percentage_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `vat_percentage` secara `ascending`
           ```txt
           BASE_URL/home/read?vat_percentage=ASC
           ```
        4. Mengurutkan home berdasarkan `vat_percentage` secara `descending`
           ```txt
           BASE_URL/home/read?vat_percentage=DESC
           ```

    - WHT is Included

      - Fungsi:
        - Untuk mencari home berdasarkan `wht_is_included` home tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_is_included: string;
        ```

      - Contoh request:
        1. Mencari home dengan wht_is_included `Yes`
           ```txt
           BASE_URL/home/read?wht_is_included=Yes
           ```
        2. Mencari home dengan wht_is_included `No`
           ```txt
           BASE_URL/home/read?wht_is_included=No
           ```
        3. Mengurutkan home berdasarkan `wht_is_included` secara `ascending`
           ```txt
           BASE_URL/home/read?wht_is_included=ASC
           ```
        4. Mengurutkan home berdasarkan `wht_is_included` secara `descending`
           ```txt
           BASE_URL/home/read?wht_is_included=DESC
           ```

    - WHT Percentage

      - Fungsi:
        - Untuk mencari home berdasarkan `wht_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_percentage: string;
        wht_percentage_from: number;
        wht_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari home dengan `minimal wht percentage` berupa 35000000
           ```txt
           BASE_URL/home/read?wht_percentage_from=35000000
           ```
        2. Mencari home dengan `wht percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/home/read?wht_percentage_from=35000000&&wht_percentage_to=12000000000
           ```
        3. Mengurutkan home berdasarkan `wht_percentage` secara `ascending`
           ```txt
           BASE_URL/home/read?wht_percentage=ASC
           ```
        4. Mengurutkan home berdasarkan `wht_percentage` secara `descending`
           ```txt
           BASE_URL/home/read?wht_percentage=DESC
           ```

  - #### Property Person in Charge

    - Fullname

      - Fungsi:
        - Untuk mencari home berdasarkan `fullname` tertentu dari `property_person_in_charges`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        pic_fullname: string;
        ```

      - Contoh request:
        1. Mencari home dengan pic_fullname `Andi Rezki Muhammad`
           ```txt
           BASE_URL/home/read?pic_fullname=Andi%20Rezki%20Muhammad
           ```

## Update or Create an `Home`

- Description:

  - Berfungsi untuk mengubah data `home` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/home/update/AMP-001`
  - Akan membuat data baru secara otomatis sesuai dengan `kode_propar` apabila data yang ingin di update belum ada

- ### URL
  - /home/update/:kode_propar
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### Optional input attribute `:` `Data type`

    - kode_propar
      ```ts
      kode_propar: {
        type: string,
        pattern: /^[A-Z]{1,7}[0-9]{3}$/
      };
      ```
    - name
      <br />Untuk mengubah `name` dari `home`
      ```ts
      name: {
        type: string,
        pattern: /[^a-zA-Z0-9 ]+/,
      };
      ```
    - pic
      <br />Untuk mengubah `person_in_charge` dari `home`

      ```ts
      pic: object || null;
      ```

      - Jika `pic` tidak kosong, maka berikut adalah `field` yang **HARUS** diubah:
        ```ts
        {
          fullname     : {
            type     : string,
            required : true
          },
          role         : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          company      : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          phone_number : {
            type     : string,
            required : true,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
        }
        ```

    - property_area
      <br />Untuk mengubah `area` dari `home`
      ```ts
      property_area: string;
      ```
    - images
      - Untuk menambah foto baru `home` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - land_size
      ```ts
      land_size: number;
      ```
    - building_size
      ```ts
      building_size: number;
      ```
    - stories
      ```ts
      stories: number;
      ```
    - furnishing
      ```ts
      furnishing: string[("Fully Furnished", "Semi Furnished", "Unfurnished")];
      ```
    - bedroom
      ```ts
      bedroom: number;
      ```
    - bathroom
      ```ts
      bathroom: number;
      ```
    - study_room
      ```ts
      study_room: number;
      ```
    - carport_or_garage
      ```ts
      carport_or_garage: number;
      ```
    - backyard
      ```ts
      backyard: boolean;
      ```
    - swimming_pool
      ```ts
      swimming_pool: boolean;
      ```
    - house_type
      ```ts
      house_type: string[("Standalone", "Compound")];
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` tidak kosong, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          selling_price               : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean,
          compound_fee                : number,
          compound_fee_coverage       : string
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika ingin mengubah/membuat data pada `home_facilities` , maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `array kosong` jika **HANYA INGIN MENGHAPUS** semua data fasilitas apartemen berdasarkan `kode_propar`
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen
      - ketika mengubah/menambah data pada `home_facilities`, API akan menghapus seluruh data fasilitas apartemen secara otomatis sebelum memasukkan data input dari pengguna

    - deleted_photo_ids

      - Untuk menghapus foto `home` berdasarkan `id`
      - Berikan nilai `true` pada `force_delete` jika ingin melakukan hard delete pada foto
      - Sebaliknya jika ingin melakukan soft delete, berikan nilai `false` pada `force_delete`

      ```ts
      deleted_photo_ids: object[] || null;
      ```

      - Jika `deleted_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:

        ```ts
        {
          id            : number,
          force_delete  : boolean
        }
        ```

    - restored_photo_ids

      - Untuk mengembalikan foto `home` yang di soft delete berdasarkan `id` foto di tabel `home_photos`

      ```ts
      restored_photo_ids: object[] || null;
      ```

      - Jika `restored_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          id: number;
        }
        ```

- ### Response

  - Expected output:

    ```txt
    Return 204 No Content and Empty Body Response
    ```

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "size": "size must be integer"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Delete specific `Home` by kode_propar

- Description:
  - Berfungsi untuk menghapus satu data `Home` sesuai dengan `kode_propar`
    dari database
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/home/delete/AMP-001`
- ### URL
  - /home/delete/:kode_propar
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "kode_propar": "kode_propar not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap office berdasarkan `kode_propar`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# Property.Land

- Merupakan API data land yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new `Land`

- Description:

  - Berfungsi untuk menambahkan data `Land` baru

- ### URL
  - /land/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    pic: {
      type: object,
      attributes: {
        "fullname": {
          type: string,
          required: true
        },
        "role": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "company": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "phone_number": {
          type: string,
          required: true,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        }
      }
    };
    ```

    ```ts
    property_area: string;
    ```

  - #### Optional input attribute `:` `Data type`

    - images
      - Untuk menambah foto baru `home` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - land_size
      ```ts
      land_size: number;
      ```
    - ownership
      ```ts
      ownership: string[("Freehold", "Leasehold")];
      ```
    - zone
      ```ts
      zone: string[("Red", "Yellow", "Green")];
      ```
    - available
      ```ts
      available: boolean;
      ```
    - surroundings
      ```ts
      surroundings: string;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` bukan _null_, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          price                : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean
        }
        ```

- ### Response

  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "lands",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get all `Land Kode Propar`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `kode_propar` dari `Land` yang terdaftar di
    dalam database
- ### URL
  - /land/read/kode_propar
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "lands",
        "attributes": [
          {
            "kode_propar": "AMP001"
          },
          {
            "kode_propar": "AMP002"
          },
          {
            "kode_propar": "AMP003"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/7/2023, 11:24:30 AM"
      }
    }
    ```

## Get all `Land`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Land` yang terdaftar di
    dalam database
- ### URL
  - /land/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "lands",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 1,
          "total_data_count": 1,
          "total_pages": 1,
          "records": [
            {
              "available": "Yes",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP001",
              "address": "Jl. Diponegoro No. 10",
              "land_size": 500,
              "ownership": "Freehold",
              "zone": "Green",
              "surroundings": "rumahnya fauziah anak metik",
              "price_currency": "Rupiah",
              "price": 500000000,
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-06-10T09:20:01.000Z",
              "updated_at": "2023-06-10T09:20:01.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Bekasi"
              },
              "property_payment_term": {
                "id": 2,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 1,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 1,
                  "name": "Kapten"
                },
                "property_person_in_charge_company": {
                  "id": 1,
                  "name": "Tim Gerbang Selatan"
                }
              },
              "photos": [
                {
                  "id": 7,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/land/AMP001/AMP001_2023-06-10-17-20-00_cat.jpg",
                  "photo_url": "/static/land/AMP001/AMP001_2023-06-10-17-20-00_cat.jpg"
                },
                {
                  "id": 8,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/land/AMP001/AMP001_2023-06-10-17-20-00_kucing.jpg",
                  "photo_url": "/static/land/AMP001/AMP001_2023-06-10-17-20-00_kucing.jpg"
                }
              ]
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "7/1/2023, 10:24:38 AM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```

  - #### Home

    - Kode Propar

      - Fungsi:
        - Untuk mencari land berdasarkan `kode_propar` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        kode_propar: string;
        ```

      - Contoh request:
        1. Mencari land dengan kode propar `AMP001`
           ```txt
           BASE_URL/land/read?kode_propar=AMP001
           ```
        2. Mengurutkan land berdasarkan `kode_propar` secara `ascending`
           ```txt
           BASE_URL/land/read?kode_propar=ASC
           ```
        3. Mengurutkan land berdasarkan `kode_propar` secara `descending`
           ```txt
           BASE_URL/land/read?kode_propar=DESC
           ```

    - Address

      - Fungsi:
        - Untuk mencari land berdasarkan `alamat` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        address: string;
        ```

      - Contoh request:
        1. Mencari land dengan alamat `Jalan Tepo`
           ```txt
           BASE_URL/land/read?address=Jalan%20Tepo
           ```
        2. Mengurutkan land berdasarkan `address` secara `ascending`
           ```txt
           BASE_URL/land/read?address=ASC
           ```
        3. Mengurutkan land berdasarkan `address` secara `descending`
           ```txt
           BASE_URL/land/read?address=DESC
           ```

    - Land Size

      - Fungsi:
        - Untuk mencari land berdasarkan `land_size` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        land_size: string;
        land_size_from: number;
        land_size_to: number;
        ```

      - Contoh request:
        1. Mencari land dengan `minimal land_size` berupa 200
           ```txt
           BASE_URL/land/read?land_size_from=200
           ```
        2. Mencari land dengan `land_size antara` 200 `hingga` 500
           ```txt
           BASE_URL/land/read?land_size_from=200&&land_size_to=500
           ```
        3. Mengurutkan land berdasarkan `land_size` secara `ascending`
           ```txt
           BASE_URL/land/read?land_size=ASC
           ```
        4. Mengurutkan land berdasarkan `land_size` secara `descending`
           ```txt
           BASE_URL/land/read?land_size=DESC
           ```

    - Ownership

      - Fungsi:
        - Untuk mencari land berdasarkan `ownership` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        ownership: string;
        ```

      - Contoh request:
        1. Mencari land dengan ownership `Leasehold`
           ```txt
           BASE_URL/land/read?ownership=Leasehold
           ```
        2. Mengurutkan land berdasarkan `ownership` secara `ascending`
           ```txt
           BASE_URL/land/read?ownership=ASC
           ```
        3. Mengurutkan land berdasarkan `ownership` secara `descending`
           ```txt
           BASE_URL/land/read?ownership=DESC
           ```

    - Zone

      - Fungsi:
        - Untuk mencari land berdasarkan `zone` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        zone: string;
        ```

      - Contoh request:
        1. Mencari land dengan zone `Green`
           ```txt
           BASE_URL/land/read?zone=Green
           ```
        2. Mengurutkan land berdasarkan `zone` secara `ascending`
           ```txt
           BASE_URL/land/read?zone=ASC
           ```
        3. Mengurutkan land berdasarkan `zone` secara `descending`
           ```txt
           BASE_URL/land/read?zone=DESC
           ```

    - Available

      - Fungsi:
        - Untuk mencari land berdasarkan `available` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        available: string;
        ```

      - Contoh request:
        1. Mencari land dengan available `Yes`
           ```txt
           BASE_URL/land/read?available=Yes
           ```
        2. Mencari land dengan available `No`
           ```txt
           BASE_URL/land/read?available=No
           ```
        3. Mengurutkan land berdasarkan `available` secara `ascending`
           ```txt
           BASE_URL/land/read?available=ASC
           ```
        4. Mengurutkan land berdasarkan `available` secara `descending`
           ```txt
           BASE_URL/land/read?available=DESC
           ```

    - Created At

      - Fungsi:
        - Untuk mencari land berdasarkan `created_at` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        created_at: string;
        ```

      - Contoh request:
        1. Mengurutkan land berdasarkan `created_at` secara `ascending`
           ```txt
           BASE_URL/land/read?created_at=ASC
           ```
        2. Mengurutkan land berdasarkan `created_at` secara `descending`
           ```txt
           BASE_URL/land/read?created_at=DESC
           ```

    - Updated At

      - Fungsi:
        - Untuk mencari land berdasarkan `updated_at` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        updated_at: string;
        ```

      - Contoh request:
        1. Mengurutkan land berdasarkan `updated_at` secara `ascending`
           ```txt
           BASE_URL/land/read?updated_at=ASC
           ```
        2. Mengurutkan land berdasarkan `updated_at` secara `descending`
           ```txt
           BASE_URL/land/read?updated_at=DESC
           ```

  - #### Property Area

    - Area

      - Fungsi:
        - Untuk mencari land berdasarkan `property_area` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        area: string;
        ```

      - Contoh request:
        1. Mencari land dengan area `Bekasi`
           ```txt
           BASE_URL/land/read?area=Bekasi
           ```

  - #### Home Fee

    - Price

      - Fungsi:
        - Untuk mencari land berdasarkan `price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        price: string;
        price_from: number;
        price_to: number;
        ```

      - Contoh request:
        1. Mencari land dengan `minimal rental price` berupa 35000000
           ```txt
           BASE_URL/land/read?price_from=35000000
           ```
        2. Mencari land dengan `rental price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/land/read?price_from=35000000&&price_to=12000000000
           ```
        3. Mengurutkan land berdasarkan `price` secara `ascending`
           ```txt
           BASE_URL/land/read?price=ASC
           ```
        4. Mengurutkan land berdasarkan `price` secara `descending`
           ```txt
           BASE_URL/land/read?price=DESC
           ```

    - Lease Term Time

      - Fungsi:
        - Untuk mencari land berdasarkan `lease_term_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_time: string;
        lease_term_time_from: number;
        lease_term_time_to: number;
        ```

      - Contoh request:
        1. Mencari land dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/land/read?lease_term_time_from=35000000
           ```
        2. Mencari land dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/land/read?lease_term_time_from=35000000&&lease_term_time_to=12000000000
           ```
        3. Mengurutkan land berdasarkan `lease_term_time` secara `ascending`
           ```txt
           BASE_URL/land/read?lease_term_time=ASC
           ```
        4. Mengurutkan land berdasarkan `lease_term_time` secara `descending`
           ```txt
           BASE_URL/land/read?lease_term_time=DESC
           ```

    - Lease Term Type

      - Fungsi:
        - Untuk mencari land berdasarkan `lease_term_type` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_type: string;
        ```

      - Contoh request:
        1. Mencari land dengan lease_term_type `Month`
           ```txt
           BASE_URL/land/read?lease_term_type=Month
           ```
        2. Mencari land dengan lease_term_type `Year`
           ```txt
           BASE_URL/land/read?lease_term_type=Year
           ```

    - Price Currency

      - Fungsi:
        - Untuk mencari land berdasarkan `price_currency` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        price_currency: string;
        ```

      - Contoh request:
        1. Mencari land dengan price_currency `Rupiah`
           ```txt
           BASE_URL/land/read?price_currency=Rupiah
           ```
        2. Mencari land dengan price_currency `US Dollar`
           ```txt
           BASE_URL/land/read?price_currency=US%20Dollar
           ```

    - Payment Term

      - Fungsi:
        - Untuk mencari land berdasarkan `payment_term` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        payment_term: string;
        ```

      - Contoh request:
        1. Mencari land dengan payment_term `Full in Advance`
           ```txt
           BASE_URL/land/read?payment_term=Full%20in%20Advance
           ```

  - #### Home Tax Fee

    - VAT is Included

      - Fungsi:
        - Untuk mencari land berdasarkan `vat_is_included` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_is_included: string;
        ```

      - Contoh request:
        1. Mencari land dengan vat_is_included `Yes`
           ```txt
           BASE_URL/land/read?vat_is_included=Yes
           ```
        2. Mencari land dengan vat_is_included `No`
           ```txt
           BASE_URL/land/read?vat_is_included=No
           ```
        3. Mengurutkan land berdasarkan `vat_is_included` secara `ascending`
           ```txt
           BASE_URL/land/read?vat_is_included=ASC
           ```
        4. Mengurutkan land berdasarkan `vat_is_included` secara `descending`
           ```txt
           BASE_URL/land/read?vat_is_included=DESC
           ```

    - VAT Percentage

      - Fungsi:
        - Untuk mencari land berdasarkan `vat_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_percentage: string;
        vat_percentage_from: number;
        vat_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari land dengan `minimal vat percentage` berupa 35000000
           ```txt
           BASE_URL/land/read?vat_percentage_from=35000000
           ```
        2. Mencari land dengan `vat percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/land/read?vat_percentage_from=35000000&&vat_percentage_to=12000000000
           ```
        3. Mengurutkan land berdasarkan `vat_percentage` secara `ascending`
           ```txt
           BASE_URL/land/read?vat_percentage=ASC
           ```
        4. Mengurutkan land berdasarkan `vat_percentage` secara `descending`
           ```txt
           BASE_URL/land/read?vat_percentage=DESC
           ```

    - WHT is Included

      - Fungsi:
        - Untuk mencari land berdasarkan `wht_is_included` land tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_is_included: string;
        ```

      - Contoh request:
        1. Mencari land dengan wht_is_included `Yes`
           ```txt
           BASE_URL/land/read?wht_is_included=Yes
           ```
        2. Mencari land dengan wht_is_included `No`
           ```txt
           BASE_URL/land/read?wht_is_included=No
           ```
        3. Mengurutkan land berdasarkan `wht_is_included` secara `ascending`
           ```txt
           BASE_URL/land/read?wht_is_included=ASC
           ```
        4. Mengurutkan land berdasarkan `wht_is_included` secara `descending`
           ```txt
           BASE_URL/land/read?wht_is_included=DESC
           ```

    - WHT Percentage

      - Fungsi:
        - Untuk mencari land berdasarkan `wht_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_percentage: string;
        wht_percentage_from: number;
        wht_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari land dengan `minimal wht percentage` berupa 35000000
           ```txt
           BASE_URL/land/read?wht_percentage_from=35000000
           ```
        2. Mencari land dengan `wht percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/land/read?wht_percentage_from=35000000&&wht_percentage_to=12000000000
           ```
        3. Mengurutkan land berdasarkan `wht_percentage` secara `ascending`
           ```txt
           BASE_URL/land/read?wht_percentage=ASC
           ```
        4. Mengurutkan land berdasarkan `wht_percentage` secara `descending`
           ```txt
           BASE_URL/land/read?wht_percentage=DESC
           ```

  - #### Property Person in Charge

    - Fullname

      - Fungsi:
        - Untuk mencari land berdasarkan `fullname` tertentu dari `property_person_in_charges`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        pic_fullname: string;
        ```

      - Contoh request:
        1. Mencari land dengan pic_fullname `Andi Rezki Muhammad`
           ```txt
           BASE_URL/land/read?pic_fullname=Andi%20Rezki%20Muhammad
           ```

## Update or Create an `Land`

- Description:

  - Berfungsi untuk mengubah data `land` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/land/update/AMP-001`
  - Akan membuat data baru secara otomatis sesuai dengan `kode_propar` apabila data yang ingin di update belum ada

- ### URL
  - /land/update/:kode_propar
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### Optional input attribute `:` `Data type`

    - kode_propar
      ```ts
      kode_propar: {
        type: string,
        pattern: /^[A-Z]{1,7}[0-9]{3}$/
      };
      ```
    - pic
      <br />Untuk mengubah `person_in_charge` dari `land`

      ```ts
      pic: object || null;
      ```

      - Jika `pic` tidak kosong, maka berikut adalah `field` yang **HARUS** diubah:
        ```ts
        {
          fullname     : {
            type     : string,
            required : true
          },
          role         : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          company      : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          phone_number : {
            type     : string,
            required : true,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
        }
        ```

    - property_area
      <br />Untuk mengubah `area` dari `land`
      ```ts
      property_area: string;
      ```
    - images
      - Untuk menambah foto baru `land` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - land_size
      ```ts
      land_size: number;
      ```
    - ownership
      ```ts
      ownership: string[("Freehold", "Leasehold")];
      ```
    - available
      ```ts
      available: boolean;
      ```
    - zone
      ```ts
      zone: string[("Red", "Yellow", "Green")];
      ```
    - surroundings
      ```ts
      surroundings: string;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` tidak kosong, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          price                       : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean
        }
        ```

    - deleted_photo_ids

      - Untuk menghapus foto `land` berdasarkan `id`
      - Berikan nilai `true` pada `force_delete` jika ingin melakukan hard delete pada foto
      - Sebaliknya jika ingin melakukan soft delete, berikan nilai `false` pada `force_delete`

      ```ts
      deleted_photo_ids: object[] || null;
      ```

      - Jika `deleted_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:

        ```ts
        {
          id            : number,
          force_delete  : boolean
        }
        ```

    - restored_photo_ids

      - Untuk mengembalikan foto `land` yang di soft delete berdasarkan `id` foto di tabel `land_photos`

      ```ts
      restored_photo_ids: object[] || null;
      ```

      - Jika `restored_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          id: number;
        }
        ```

- ### Response

  - Expected output:

    ```txt
    Return 204 No Content and Empty Body Response
    ```

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "size": "size must be integer"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Delete specific `Land` by kode_propar

- Description:
  - Berfungsi untuk menghapus satu data `Land` sesuai dengan `kode_propar`
    dari database
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/land/delete/AMP-001`
- ### URL
  - /land/delete/:kode_propar
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "kode_propar": "kode_propar not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap office berdasarkan `kode_propar`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# Property.Office

- Merupakan API data office yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new `Office`

- Description:

  - Berfungsi untuk menambahkan data `Office` baru

- ### URL
  - /office/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    name: {
      type: string,
      pattern: /[^a-zA-Z0-9 ]+/
    };
    ```

    ```ts
    pic: {
      type: object,
      attributes: {
        "fullname": {
          type: string,
          required: true
        },
        "role": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "company": {
          type: string,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        },
        "phone_number": {
          type: string,
          required: true,
          desc: "masukkan atribut ini jika ingin membuat PIC baru"
        }
      }
    };
    ```

    ```ts
    property_area: string;
    ```

  - #### Optional input attribute `:` `Data type`

    - images
      - Untuk menambah foto baru `office` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - semi_gross_area
      ```ts
      semi_gross_area: number;
      ```
    - grade
      ```ts
      grade: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - floor
      ```ts
      floor: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - condition
      ```ts
      condition: string[("Fitted", "Semi Fitted", "Bare")];
      ```
    - building_completion
      ```ts
      building_completion: number;
      ```
    - certificates
      ```ts
      certificates: string;
      ```
    - security_deposit
      ```ts
      security_deposit: string;
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` bukan _null_, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          sell_price                  : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          service_charge_price        : number,
          service_charge_time         : string[("Year", "Month")],
          overtime_price              : number,
          overtime_time               : string[("Day", "Hour")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean,
          parking_ratio               : number
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika `facilities` bukan _null_ maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen

- ### Response

  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "offices",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get all `Office Kode Propar`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `kode_propar` dari `Office` yang terdaftar di
    dalam database
- ### URL
  - /office/read/kode_propar
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "offices",
        "attributes": [
          {
            "kode_propar": "AMP001"
          },
          {
            "kode_propar": "AMP002"
          },
          {
            "kode_propar": "AMP003"
          }
        ]
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/7/2023, 11:24:30 AM"
      }
    }
    ```

## Get all `Office`

- Description:
  - Berfungsi untuk mengembalikan seluruh data `Office` yang terdaftar di
    dalam database
- ### URL
  - /office/read
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "offices",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 2,
          "total_data_count": 2,
          "total_pages": 1,
          "records": [
            {
              "available": "Yes",
              "service_charge_details": "10000000/Month(s)",
              "overtime_details": "100000/Hour(s)",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP001",
              "name": "Ampera Office 1",
              "address": "Jl. Diponegoro, No. 11",
              "semi_gross_area": 500,
              "building_completion": 2020,
              "certificates": "1 juta poin SK2PM",
              "grade": "A2",
              "floor": "10",
              "condition": "Fitted",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "service_charge_price": 10000000,
              "service_charge_time": "Month",
              "overtime_price": 100000,
              "overtime_time": "Hour",
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "security_deposit": "No information",
              "parking_ratio": 500000,
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-05-18T07:54:51.000Z",
              "updated_at": "2023-05-18T08:58:35.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Ampera"
              },
              "property_payment_term": {
                "id": 5,
                "payment_term": "Quarterly in Advance"
              },
              "property_person_in_charge": {
                "id": 19,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 2,
                  "name": "Owner"
                },
                "property_person_in_charge_company": {
                  "id": 16,
                  "name": "Ayam Jago"
                }
              },
              "facilities": [
                {
                  "id": 6,
                  "property_facility_name": {
                    "id": 5,
                    "facility_name": "Sauna"
                  }
                },
                {
                  "id": 5,
                  "property_facility_name": {
                    "id": 13,
                    "facility_name": "Ballroom"
                  }
                }
              ],
              "photos": [
                {
                  "id": 5,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-15-54-48_7JHxy2UO_400x400.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-15-54-48_7JHxy2UO_400x400.jpg"
                },
                {
                  "id": 6,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-15-54-48_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-15-54-48_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                },
                {
                  "id": 7,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-15-54-48_a mimir.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-15-54-48_a mimir.jpg"
                },
                {
                  "id": 8,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-15-54-48_ayaya.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-15-54-48_ayaya.jpg"
                }
              ]
            },
            {
              "available": "Yes",
              "service_charge_details": "10000000/Month(s)",
              "overtime_details": "1000000/Day(s)",
              "vat_details": "5% VAT Included within Price",
              "wht_details": "2% WHT Excluded from Price",
              "lease_term_details": "1 Year(s)",
              "kode_propar": "AMP002",
              "name": "Ampera Office 2",
              "address": "Jl. Diponegoro, No. 11",
              "semi_gross_area": 500,
              "building_completion": 2020,
              "certificates": "1 juta poin SK2PM",
              "grade": "A2",
              "floor": "10",
              "condition": "Fitted",
              "price_currency": "Rupiah",
              "rental_price": 500000000,
              "selling_price": 5000000000,
              "service_charge_price": 10000000,
              "service_charge_time": "Month",
              "overtime_price": 1000000,
              "overtime_time": "Day",
              "vat_percentage": 5,
              "vat_is_included": true,
              "wht_percentage": 2,
              "wht_is_included": false,
              "lease_term_time": 1,
              "lease_term_type": "Year",
              "security_deposit": "No information",
              "parking_ratio": 500000,
              "remarks_1": "Ada Aceng",
              "remarks_2": "WC ngebug",
              "remarks_3": "Dihuni raja himpunan",
              "created_at": "2023-05-18T12:46:50.000Z",
              "updated_at": "2023-05-18T12:46:50.000Z",
              "property_area": {
                "id": 5,
                "region_name": "Ampera"
              },
              "property_payment_term": {
                "id": 3,
                "payment_term": "Full in Advance"
              },
              "property_person_in_charge": {
                "id": 19,
                "fullname": "Harry Kane",
                "phone_number": "082144569073",
                "property_person_in_charge_role": {
                  "id": 2,
                  "name": "Owner"
                },
                "property_person_in_charge_company": {
                  "id": 16,
                  "name": "Ayam Jago"
                }
              },
              "facilities": [
                {
                  "id": 7,
                  "property_facility_name": {
                    "id": 11,
                    "facility_name": "Waterpark"
                  }
                },
                {
                  "id": 8,
                  "property_facility_name": {
                    "id": 12,
                    "facility_name": "Basketball Field"
                  }
                }
              ],
              "photos": [
                {
                  "id": 9,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-20-46-49_7JHxy2UO_400x400.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-20-46-49_7JHxy2UO_400x400.jpg"
                },
                {
                  "id": 10,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-20-46-49_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-20-46-49_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                },
                {
                  "id": 11,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-20-46-49_a mimir.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-20-46-49_a mimir.jpg"
                },
                {
                  "id": 12,
                  "photo_path": "/home/nas11ai/npa-database/server/assets/office/AMP002/AMP002_2023-05-18-20-46-49_ayaya.jpg",
                  "photo_url": "/static/office/AMP002/AMP002_2023-05-18-20-46-49_ayaya.jpg"
                }
              ]
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "5/18/2023, 8:47:07 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```

  - #### Office

    - Kode Propar

      - Fungsi:
        - Untuk mencari office berdasarkan `kode_propar` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        kode_propar: string;
        ```

      - Contoh request:
        1. Mencari office dengan kode propar `AMP001`
           ```txt
           BASE_URL/office/read?kode_propar=AMP001
           ```
        2. Mengurutkan office berdasarkan `kode_propar` secara `ascending`
           ```txt
           BASE_URL/office/read?kode_propar=ASC
           ```
        3. Mengurutkan office berdasarkan `kode_propar` secara `descending`
           ```txt
           BASE_URL/office/read?kode_propar=DESC
           ```

    - Name

      - Fungsi:
        - Untuk mencari office berdasarkan `nama` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        name: string;
        ```

      - Contoh request:
        1. Mencari office dengan nama `Ampera Mansion`
           ```txt
           BASE_URL/office/read?name=Ampera%20Mansion
           ```
        2. Mengurutkan office berdasarkan `name` secara `ascending`
           ```txt
           BASE_URL/office/read?name=ASC
           ```
        3. Mengurutkan office berdasarkan `name` secara `descending`
           ```txt
           BASE_URL/office/read?name=DESC
           ```

    - Address

      - Fungsi:
        - Untuk mencari office berdasarkan `alamat` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        address: string;
        ```

      - Contoh request:
        1. Mencari office dengan alamat `Jalan Tepo`
           ```txt
           BASE_URL/office/read?address=Jalan%20Tepo
           ```
        2. Mengurutkan office berdasarkan `address` secara `ascending`
           ```txt
           BASE_URL/office/read?address=ASC
           ```
        3. Mengurutkan office berdasarkan `address` secara `descending`
           ```txt
           BASE_URL/office/read?address=DESC
           ```

    - Semi Gross Area

      - Fungsi:
        - Untuk mencari office berdasarkan `semi_gross_area` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        semi_gross_area: string;
        semi_gross_area_from: number;
        semi_gross_area_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal semi_gross_area` berupa 200
           ```txt
           BASE_URL/office/read?semi_gross_area_from=200
           ```
        2. Mencari office dengan `semi_gross_area antara` 200 `hingga` 500
           ```txt
           BASE_URL/office/read?semi_gross_area_from=200&&semi_gross_area_to=500
           ```
        3. Mengurutkan office berdasarkan `semi_gross_area` secara `ascending`
           ```txt
           BASE_URL/office/read?semi_gross_area=ASC
           ```
        4. Mengurutkan office berdasarkan `semi_gross_area` secara `descending`
           ```txt
           BASE_URL/office/read?semi_gross_area=DESC
           ```

    - Grade

      - Fungsi:
        - Untuk mencari office berdasarkan `grade` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        grade: string;
        ```

      - Contoh request:
        1. Mencari office dengan grade `3A`
           ```txt
           BASE_URL/office/read?grade=3A
           ```
        2. Mengurutkan office berdasarkan `grade` secara `ascending`
           ```txt
           BASE_URL/office/read?grade=ASC
           ```
        3. Mengurutkan office berdasarkan `grade` secara `descending`
           ```txt
           BASE_URL/office/read?grade=DESC
           ```

    - Floor

      - Fungsi:
        - Untuk mencari office berdasarkan `floor` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        floor: string;
        ```

      - Contoh request:
        1. Mencari office dengan floor `10`
           ```txt
           BASE_URL/office/read?floor=10
           ```
        2. Mengurutkan office berdasarkan `floor` secara `ascending`
           ```txt
           BASE_URL/office/read?floor=ASC
           ```
        3. Mengurutkan office berdasarkan `floor` secara `descending`
           ```txt
           BASE_URL/office/read?floor=DESC
           ```

    - Condition

      - Fungsi:
        - Untuk mencari office berdasarkan `condition` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        condition: string;
        ```

      - Contoh request:
        1. Mencari office dengan condition `Fully Furnished`
           ```txt
           BASE_URL/office/read?condition=Fully%20Furnished
           ```
        2. Mengurutkan office berdasarkan `condition` secara `ascending`
           ```txt
           BASE_URL/office/read?condition=ASC
           ```
        3. Mengurutkan office berdasarkan `condition` secara `descending`
           ```txt
           BASE_URL/office/read?condition=DESC
           ```

    - Available

      - Fungsi:
        - Untuk mencari office berdasarkan `available` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        available: string;
        ```

      - Contoh request:
        1. Mencari office dengan available `Yes`
           ```txt
           BASE_URL/office/read?available=Yes
           ```
        2. Mencari office dengan available `No`
           ```txt
           BASE_URL/office/read?available=No
           ```
        3. Mengurutkan office berdasarkan `available` secara `ascending`
           ```txt
           BASE_URL/office/read?available=ASC
           ```
        4. Mengurutkan office berdasarkan `available` secara `descending`
           ```txt
           BASE_URL/office/read?available=DESC
           ```

    - Building Completion

      - Fungsi:
        - Untuk mencari office berdasarkan `building_completion` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        building_completion_from: number;
        building_completion_to: number;
        ```

      - Contoh request:

        1. Mencari office dengan `minimal building_completion` berupa 35000000
           ```txt
           BASE_URL/office/read?building_completion_from=35000000
           ```
        2. Mencari office dengan `building_completion antara` 35000000 `hingga` 12000000000

           ```txt
           BASE_URL/office/read?building_completion_from=35000000&&building_completion_to=12000000000
           ```

           ```

           ```

    - Created At

      - Fungsi:
        - Untuk mencari office berdasarkan `created_at` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        created_at: string;
        ```

      - Contoh request:
        1. Mengurutkan office berdasarkan `created_at` secara `ascending`
           ```txt
           BASE_URL/office/read?created_at=ASC
           ```
        2. Mengurutkan office berdasarkan `created_at` secara `descending`
           ```txt
           BASE_URL/office/read?created_at=DESC
           ```

    - Updated At

      - Fungsi:
        - Untuk mencari office berdasarkan `updated_at` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        updated_at: string;
        ```

      - Contoh request:
        1. Mengurutkan office berdasarkan `updated_at` secara `ascending`
           ```txt
           BASE_URL/office/read?updated_at=ASC
           ```
        2. Mengurutkan office berdasarkan `updated_at` secara `descending`
           ```txt
           BASE_URL/office/read?updated_at=DESC
           ```

  - #### Office Facility

    - Facility Name

      - Fungsi:
        - Untuk mencari office berdasarkan `property_facility_name` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        facility_name: string;
        ```

      - Contoh request:
        1. Mencari office dengan facility_name `Bedroom`
           ```txt
           BASE_URL/office/read?facility_name=Bedroom
           ```

  - #### Property Area

    - Area

      - Fungsi:
        - Untuk mencari office berdasarkan `property_area` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        area: string;
        ```

      - Contoh request:
        1. Mencari office dengan area `Bekasi`
           ```txt
           BASE_URL/office/read?area=Bekasi
           ```

  - #### Office Fee

    - Rental Price

      - Fungsi:
        - Untuk mencari office berdasarkan `rental_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        rental_price: string;
        rental_price_from: number;
        rental_price_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal rental price` berupa 35000000
           ```txt
           BASE_URL/office/read?rental_price_from=35000000
           ```
        2. Mencari office dengan `rental price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?rental_price_from=35000000&&rental_price_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `rental_price` secara `ascending`
           ```txt
           BASE_URL/office/read?rental_price=ASC
           ```
        4. Mengurutkan office berdasarkan `rental_price` secara `descending`
           ```txt
           BASE_URL/office/read?rental_price=DESC
           ```

    - Selling Price

      - Fungsi:
        - Untuk mencari office berdasarkan `selling_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        selling_price: string;
        selling_price_from: number;
        selling_price_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal selling price` berupa 35000000
           ```txt
           BASE_URL/office/read?selling_price_from=35000000
           ```
        2. Mencari office dengan `selling price antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?selling_price_from=35000000&&selling_price_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `selling_price` secara `ascending`
           ```txt
           BASE_URL/office/read?selling_price=ASC
           ```
        4. Mengurutkan office berdasarkan `selling_price` secara `descending`
           ```txt
           BASE_URL/office/read?selling_price=DESC
           ```

    - Service Charge Price

      - Fungsi:
        - Untuk mencari office berdasarkan `service_charge_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        service_charge_price: string;
        service_charge_price_from: number;
        service_charge_price_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/office/read?service_charge_price_from=35000000
           ```
        2. Mencari office dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?service_charge_price_from=35000000&&service_charge_price_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `service_charge_price` secara `ascending`
           ```txt
           BASE_URL/office/read?service_charge_price=ASC
           ```
        4. Mengurutkan office berdasarkan `service_charge_price` secara `descending`
           ```txt
           BASE_URL/office/read?service_charge_price=DESC
           ```

    - Service Charge Time

      - Fungsi:
        - Untuk mencari office berdasarkan `service_charge_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        service_charge_time: string;
        ```

      - Contoh request:
        1. Mencari office dengan service_charge_time `Month`
           ```txt
           BASE_URL/office/read?service_charge_time=Month
           ```
        2. Mencari office dengan service_charge_time `Year`
           ```txt
           BASE_URL/office/read?service_charge_time=Year
           ```

    - Overtime Price

      - Fungsi:
        - Untuk mencari office berdasarkan `overtime_price` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        overtime_price: string;
        overtime_price_from: number;
        overtime_price_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/office/read?overtime_price_from=35000000
           ```
        2. Mencari office dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?overtime_price_from=35000000&&overtime_price_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `overtime_price` secara `ascending`
           ```txt
           BASE_URL/office/read?overtime_price=ASC
           ```
        4. Mengurutkan office berdasarkan `overtime_price` secara `descending`
           ```txt
           BASE_URL/office/read?overtime_price=DESC
           ```

    - Overtime Time

      - Fungsi:
        - Untuk mencari office berdasarkan `overtime_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        overtime_time: string;
        ```

      - Contoh request:
        1. Mencari office dengan overtime_time `Hour`
           ```txt
           BASE_URL/office/read?overtime_time=Hour
           ```
        2. Mencari office dengan overtime_time `Day`
           ```txt
           BASE_URL/office/read?overtime_time=Day
           ```

    - Lease Term Time

      - Fungsi:
        - Untuk mencari office berdasarkan `lease_term_time` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_time: string;
        lease_term_time_from: number;
        lease_term_time_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal lease term time` berupa 35000000
           ```txt
           BASE_URL/office/read?lease_term_time_from=35000000
           ```
        2. Mencari office dengan `lease term time antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?lease_term_time_from=35000000&&lease_term_time_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `lease_term_time` secara `ascending`
           ```txt
           BASE_URL/office/read?lease_term_time=ASC
           ```
        4. Mengurutkan office berdasarkan `lease_term_time` secara `descending`
           ```txt
           BASE_URL/office/read?lease_term_time=DESC
           ```

    - Lease Term Type

      - Fungsi:
        - Untuk mencari office berdasarkan `lease_term_type` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        lease_term_type: string;
        ```

      - Contoh request:
        1. Mencari office dengan lease_term_type `Month`
           ```txt
           BASE_URL/office/read?lease_term_type=Month
           ```
        2. Mencari office dengan lease_term_type `Year`
           ```txt
           BASE_URL/office/read?lease_term_type=Year
           ```

    - Price Currency

      - Fungsi:
        - Untuk mencari office berdasarkan `price_currency` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        price_currency: string;
        ```

      - Contoh request:
        1. Mencari office dengan price_currency `Rupiah`
           ```txt
           BASE_URL/office/read?price_currency=Rupiah
           ```
        2. Mencari office dengan price_currency `US Dollar`
           ```txt
           BASE_URL/office/read?price_currency=US%20Dollar
           ```

    - Payment Term

      - Fungsi:
        - Untuk mencari office berdasarkan `payment_term` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        payment_term: string;
        ```

      - Contoh request:
        1. Mencari office dengan payment_term `Full in Advance`
           ```txt
           BASE_URL/office/read?payment_term=Full%20in%20Advance
           ```

  - #### Office Tax Fee

    - VAT is Included

      - Fungsi:
        - Untuk mencari office berdasarkan `vat_is_included` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_is_included: string;
        ```

      - Contoh request:
        1. Mencari office dengan vat_is_included `Yes`
           ```txt
           BASE_URL/office/read?vat_is_included=Yes
           ```
        2. Mencari office dengan vat_is_included `No`
           ```txt
           BASE_URL/office/read?vat_is_included=No
           ```
        3. Mengurutkan office berdasarkan `vat_is_included` secara `ascending`
           ```txt
           BASE_URL/office/read?vat_is_included=ASC
           ```
        4. Mengurutkan office berdasarkan `vat_is_included` secara `descending`
           ```txt
           BASE_URL/office/read?vat_is_included=DESC
           ```

    - VAT Percentage

      - Fungsi:
        - Untuk mencari office berdasarkan `vat_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        vat_percentage: string;
        vat_percentage_from: number;
        vat_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal vat percentage` berupa 35000000
           ```txt
           BASE_URL/office/read?vat_percentage_from=35000000
           ```
        2. Mencari office dengan `vat percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?vat_percentage_from=35000000&&vat_percentage_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `vat_percentage` secara `ascending`
           ```txt
           BASE_URL/office/read?vat_percentage=ASC
           ```
        4. Mengurutkan office berdasarkan `vat_percentage` secara `descending`
           ```txt
           BASE_URL/office/read?vat_percentage=DESC
           ```

    - WHT is Included

      - Fungsi:
        - Untuk mencari office berdasarkan `wht_is_included` office tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_is_included: string;
        ```

      - Contoh request:
        1. Mencari office dengan wht_is_included `Yes`
           ```txt
           BASE_URL/office/read?wht_is_included=Yes
           ```
        2. Mencari office dengan wht_is_included `No`
           ```txt
           BASE_URL/office/read?wht_is_included=No
           ```
        3. Mengurutkan office berdasarkan `wht_is_included` secara `ascending`
           ```txt
           BASE_URL/office/read?wht_is_included=ASC
           ```
        4. Mengurutkan office berdasarkan `wht_is_included` secara `descending`
           ```txt
           BASE_URL/office/read?wht_is_included=DESC
           ```

    - WHT Percentage

      - Fungsi:
        - Untuk mencari office berdasarkan `wht_percentage` tertentu
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        wht_percentage: string;
        wht_percentage_from: number;
        wht_percentage_to: number;
        ```

      - Contoh request:
        1. Mencari office dengan `minimal wht percentage` berupa 35000000
           ```txt
           BASE_URL/office/read?wht_percentage_from=35000000
           ```
        2. Mencari office dengan `wht percentage antara` 35000000 `hingga` 12000000000
           ```txt
           BASE_URL/office/read?wht_percentage_from=35000000&&wht_percentage_to=12000000000
           ```
        3. Mengurutkan office berdasarkan `wht_percentage` secara `ascending`
           ```txt
           BASE_URL/office/read?wht_percentage=ASC
           ```
        4. Mengurutkan office berdasarkan `wht_percentage` secara `descending`
           ```txt
           BASE_URL/office/read?wht_percentage=DESC
           ```

  - #### Property Person in Charge

    - Fullname

      - Fungsi:
        - Untuk mencari office berdasarkan `fullname` tertentu dari `property_person_in_charges`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        pic_fullname: string;
        ```

      - Contoh request:
        1. Mencari office dengan pic_fullname `Andi Rezki Muhammad`
           ```txt
           BASE_URL/office/read?pic_fullname=Andi%20Rezki%20Muhammad
           ```

## Update or Create an `Office`

- Description:

  - Berfungsi untuk mengubah data `office` yang sudah terdaftar di tabel
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/office/update/AMP-001`
  - Akan membuat data baru secara otomatis sesuai dengan `kode_propar` apabila data yang ingin di update belum ada

- ### URL
  - /office/update/:kode_propar
- ### Method
  - PUT
- ### Request Data

  - #### Content-Type

    ```txt
    multipart/form-data
    ```

  - #### Optional input attribute `:` `Data type`

    - kode_propar
      ```ts
      kode_propar: {
        type: string,
        pattern: /^[A-Z]{1,7}[0-9]{3}$/
      };
      ```
    - name
      <br />Untuk mengubah `name` dari `office`
      ```ts
      name: {
        type: string,
        pattern: /[^a-zA-Z0-9 ]+/,
      };
      ```
    - pic
      <br />Untuk mengubah `person_in_charge` dari `office`

      ```ts
      pic: object || null;
      ```

      - Jika `pic` tidak kosong, maka berikut adalah `field` yang **HARUS** diubah:
        ```ts
        {
          fullname     : {
            type     : string,
            required : true
          },
          role         : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          company      : {
            type     : string,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
          phone_number : {
            type     : string,
            required : true,
            desc     : "masukkan atribut ini jika ingin membuat PIC baru"
          },
        }
        ```

    - property_area
      <br />Untuk mengubah `area` dari `office`
      ```ts
      property_area: string;
      ```
    - images
      - Untuk menambah foto baru `office` dengan maksimal ukuran file `100 MB` dan jumlah file sebesar `10` di dalam server
      - Hanya bisa menerima tipe file dengan ekstensi `.jpg`, `.jpeg`, dan `.png`
      ```ts
      images: object[];
      ```
    - address
      ```ts
      address: {
        type: string,
        pattern: /[^a-zA-Z0-9., ]+/,
      };
      ```
    - semi_gross_area
      ```ts
      semi_gross_area: number;
      ```
    - grade
      ```ts
      grade: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - floor
      ```ts
      floor: {
        type: string,
        pattern: /[^a-zA-Z0-9]+/,
      };
      ```
    - condition
      ```ts
      condition: string[("Fitted", "Semi Fitted", "Bare")];
      ```
    - building_completion
      ```ts
      building_completion: number;
      ```
    - certificates
      ```ts
      certificates: string;
      ```
    - security_deposit
      ```ts
      security_deposit: string;
      ```
    - available
      ```ts
      available: boolean;
      ```
    - remarks_1
      ```ts
      remarks_1: string;
      ```
    - remarks_2
      ```ts
      remarks_2: string;
      ```
    - remarks_3
      ```ts
      remarks_3: string;
      ```
    - fees

      ```ts
      fees: object || null;
      ```

      - Jika `fees` tidak kosong, maka berikut adalah `field yang bisa diubah (optional)`:
        ```ts
        {
          rental_price                : number,
          sell_price                  : number,
          price_currency              : string[("Rupiah", "US Dollar")],
          service_charge_price        : number,
          service_charge_time         : string[("Year", "Month")],
          overtime_price              : number,
          overtime_time               : string[("Day", "Hour")],
          property_payment_terms_name : string,
          lease_term_time             : number,
          lease_term_type             : string[("Year", "Month")],
          vat_percentage              : number,
          vat_is_included             : boolean,
          wht_percentage              : number,
          wht_is_included             : boolean,
          parking_ratio               : number
        }
        ```

    - facilities

      ```ts
      facilities: object[] || null;
      ```

      - Jika ingin mengubah/membuat data pada `office_facilities` , maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          property_facility_name: string;
        }
        ```
      - Isi `facilities` dengan `array kosong` jika **HANYA INGIN MENGHAPUS** semua data fasilitas apartemen berdasarkan `kode_propar`
      - Isi `facilities` dengan `null` jika **TIDAK INGIN MENGUBAH** data fasilitas apartemen
      - ketika mengubah/menambah data pada `office_facilities`, API akan menghapus seluruh data fasilitas apartemen secara otomatis sebelum memasukkan data input dari pengguna

    - deleted_photo_ids

      - Untuk menghapus foto `office` berdasarkan `id`
      - Berikan nilai `true` pada `force_delete` jika ingin melakukan hard delete pada foto
      - Sebaliknya jika ingin melakukan soft delete, berikan nilai `false` pada `force_delete`

      ```ts
      deleted_photo_ids: object[] || null;
      ```

      - Jika `deleted_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:

        ```ts
        {
          id            : number,
          force_delete  : boolean
        }
        ```

    - restored_photo_ids

      - Untuk mengembalikan foto `office` yang di soft delete berdasarkan `id` foto di tabel `office_photos`

      ```ts
      restored_photo_ids: object[] || null;
      ```

      - Jika `restored_photo_ids` tidak kosong, maka berikut adalah field yang **HARUS** diisi:
        ```ts
        {
          id: number;
        }
        ```

- ### Response

  - Expected output:

    ```txt
    Return 204 No Content and Empty Body Response
    ```

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "size": "size must be integer"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Delete specific `Office` by kode_propar

- Description:
  - Berfungsi untuk menghapus satu data `Office` sesuai dengan `kode_propar`
    dari database
  - Membutuhkan `route parameter` berupa `kode_propar` dalam bentuk `string`.
    Contoh: `BASE_URL/office/delete/AMP-001`
- ### URL
  - /office/delete/:kode_propar
- ### Method
  - DELETE
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:
    ```txt
    Return 204 No Content and Empty Body Response
    ```
  - Error response:

    ```json
    {
      "code": 404,
      "status": "NOT_FOUND",
      "errors": {
        "kode_propar": "kode_propar not found"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Hard Delete

    - force

      - Fungsi:
        - Untuk melakukan hard delete terhadap office berdasarkan `kode_propar`
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        force: boolean;
        ```

# PropertyPartialan

- Merupakan API data property partialan yang terdaftar di database
- Membutuhkan `Authorization` Header berisikan `bearer token` agar API bisa
  diakses

## Add new `PropertyPartialan`

- Description:

  - Berfungsi untuk menambahkan data `PropertyPartialan` baru untuk `public link`

- ### URL
  - /property_partialan/public_link/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    application/json
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    property_type: {
      type: string,
      value: ("Apartment", "Home", "Land", "Office")
    };
    ```

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    photos_id: {
      type: number[],
      desc: "minimal memilih 4 foto"
    };
    ```

    ```ts
    area_id: number;
    ```

    ```ts
    selected_property_data: {
      type: string[],
      desc: "kolom yang dipilih tergantung pada value dari `property_type`"
    };
    ```

  - #### Value selected_property_data

    - `Apartment`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `furnishing` (required)
      - `size`
      - `floor`
      - `tower`
      - `bedroom`
      - `bathroom`
      - `study_room`
      - `price_currency`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Home`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `furnishing` (required)
      - `land_size`
      - `building_size`
      - `stories`
      - `bedroom`
      - `bathroom`
      - `study_room`
      - `carport_or_garage`
      - `backyard`
      - `swimming_pool`
      - `house_type`
      - `price_currency`
      - `compound_fee`
      - `compound_fee_coverage`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Land`:
      - `address` (required)
      - `price` (required)
      - `available` (required)
      - `ownership` (required)
      - `land_size`
      - `zone`
      - `surroundings`
      - `price_currency`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Office`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `condition` (required)
      - `building_completion`
      - `certificates`
      - `grade`
      - `floor`
      - `semi_gross_area`
      - `price_currency`
      - `service_charge_details`
      - `overtime_details`
      - `security_deposit`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `parking_ratio`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`

  - #### Optional input attribute `:` `Data type`

    ```ts
    facilities_id: number[];
    ```

    ```ts
    payment_term_id: number;
    ```

- ### Response

  - Expected output:
    ```json
    {
      "code": 201,
      "status": "CREATED",
      "data": {
        "type": "property_partialans",
        "attributes": null
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:11:24 PM"
      }
    }
    ```
  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

## Get `PropertyPartialan` by ID

- Description:
  - Berfungsi untuk mengembalikan data `PropertyPartialan` yang terdaftar di
    dalam database berdasarkan ID berupa `public link`
- ### URL
  - /property_partialan/public_link/read/:id
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "property_partialans",
        "attributes": {
          "id": "d7d9d157-09a8-45f7-8f7d-a9c466210a48",
          "property_type": "Apartment",
          "content": {
            "name": "Ampera Apartment 11",
            "size": 200,
            "floor": "10",
            "tower": "2",
            "photos": [
              {
                "id": 1,
                "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg",
                "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg"
              },
              {
                "id": 2,
                "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
              }
            ],
            "address": "Jl. Diponegoro, No. 10",
            "bedroom": 2,
            "bathroom": 2,
            "available": "Yes",
            "remarks_1": "Unreachable",
            "remarks_2": "Plumbing issue",
            "remarks_3": "TBA",
            "facilities": [
              {
                "id": 1,
                "property_facility_name": {
                  "id": 1,
                  "facility_name": "Carpool"
                }
              },
              {
                "id": 2,
                "property_facility_name": {
                  "id": 2,
                  "facility_name": "Bunker"
                }
              }
            ],
            "furnishing": "Fully Furnished",
            "study_room": 1,
            "kode_propar": "AMP011",
            "vat_details": "5% VAT Included within Price",
            "wht_details": "2% WHT Excluded from Price",
            "rental_price": 500000000,
            "property_area": {
              "id": 1,
              "region_name": "Pasar Senen"
            },
            "selling_price": 5000000000,
            "price_currency": "Rupiah",
            "vat_percentage": 5,
            "wht_percentage": 2,
            "lease_term_time": 1,
            "lease_term_type": "Year",
            "vat_is_included": true,
            "wht_is_included": false,
            "lease_term_details": "1 Year(s)",
            "property_payment_term": {
              "id": 1,
              "payment_term": "Half in Advance"
            }
          }
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/29/2023, 7:57:52 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Get `PropertyPartialan` data for excel/pdf

- Description:

  - Berfungsi untuk mengembalikan data property untuk `PropertyPartialan` dalam format `excel/pdf`
  - Request body harus berupa `array of object`

- ### URL
  - /property_partialan/excel_pdf/create
- ### Method
  - POST
- ### Request Data

  - #### Content-Type

    ```txt
    application/json
    ```

  - #### `Required input attribute` `:` `Data type`

    ```ts
    property_type: {
      type: string,
      value: ("Apartment", "Home", "Land", "Office")
    };
    ```

    ```ts
    kode_propar: {
      type: string,
      pattern: /^[A-Z]{1,7}[0-9]{3}$/
    };
    ```

    ```ts
    photos_id: {
      type: number[],
      desc: "minimal memilih 4 foto"
    };
    ```

    ```ts
    area_id: number;
    ```

    ```ts
    selected_property_data: {
      type: string[],
      desc: "kolom yang dipilih tergantung pada value dari `property_type`"
    };
    ```

  - #### Value selected_property_data

    - `Apartment`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `furnishing` (required)
      - `size`
      - `floor`
      - `tower`
      - `bedroom`
      - `bathroom`
      - `study_room`
      - `price_currency`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Home`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `furnishing` (required)
      - `land_size`
      - `building_size`
      - `stories`
      - `bedroom`
      - `bathroom`
      - `study_room`
      - `carport_or_garage`
      - `backyard`
      - `swimming_pool`
      - `house_type`
      - `price_currency`
      - `compound_fee`
      - `compound_fee_coverage`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Land`:
      - `address` (required)
      - `price` (required)
      - `available` (required)
      - `ownership` (required)
      - `land_size`
      - `zone`
      - `surroundings`
      - `price_currency`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`
    - `Office`:
      - `name` (required)
      - `address` (required)
      - `rental_price` (required)
      - `selling_price` (required)
      - `available` (required)
      - `condition` (required)
      - `building_completion`
      - `certificates`
      - `grade`
      - `floor`
      - `semi_gross_area`
      - `price_currency`
      - `service_charge_details`
      - `overtime_details`
      - `security_deposit`
      - `vat_details`
      - `wht_details`
      - `lease_term_details`
      - `parking_ratio`
      - `remarks_1`
      - `remarks_2`
      - `remarks_3`

  - #### Optional input attribute `:` `Data type`

    ```ts
    facilities_id: number[];
    ```

    ```ts
    payment_term_id: number;
    ```

- ### Request Body Example

  ````json
  [
          {
            "property_type": "Apartment",
            "kode_propar": "AMP011",
            "facilities_id": [1, 2],
            "photos_id": [1, 2],
            "area_id": 1,
            "payment_term_id": 1,
            "selected_property_data": [
              "name",
              "address",
              "rental_price",
              "selling_price",
              "available",
              "furnishing",
              "size",
              "floor",
              "tower",
              "bedroom",
              "bathroom",
              "study_room",
              "price_currency",
              "vat_details",
              "wht_details",
              "lease_term_details",
              "remarks_1",
              "remarks_2",
              "remarks_3"
            ]
          },
          {
            "property_type": "Apartment",
            "kode_propar": "AMP011",
            "facilities_id": [1, 2],
            "photos_id": [1, 2],
            "area_id": 1,
            "payment_term_id": 1,
            "selected_property_data": [
              "name",
              "address",
              "rental_price",
              "selling_price",
              "available",
              "furnishing",
              "size",
              "floor",
              "tower",
              "bedroom",
              "bathroom",
              "study_room",
              "price_currency",
              "vat_details",
              "wht_details",
              "lease_term_details",
              "remarks_1",
              "remarks_2",
              "remarks_3"
            ]
          },
          {
            "property_type": "Apartment",
            "kode_propar": "AMP011",
            "facilities_id": [1, 2],
            "photos_id": [1, 2],
            "area_id": 1,
            "payment_term_id": 1,
            "selected_property_data": [
              "name",
              "address",
              "rental_price",
              "selling_price",
              "available",
              "furnishing",
              "size",
              "floor",
              "tower",
              "bedroom",
              "bathroom",
              "study_room",
              "price_currency",
              "vat_details",
              "wht_details",
              "lease_term_details",
              "remarks_1",
              "remarks_2",
              "remarks_3"
            ]
          }
        ]
        ```

      - ### Response

        - Expected output:
          ```json
          {
          "code": 201,
          "status": "CREATED",
          "data": {
              "type": "property_partialans",
              "attributes": [
                  {
                      "available": "Yes",
                      "vat_details": "5% VAT Included within Price",
                      "wht_details": "2% WHT Excluded from Price",
                      "lease_term_details": "1 Year(s)",
                      "name": "Ampera Apartment 11",
                      "address": "Jl. Diponegoro, No. 10",
                      "rental_price": 500000000,
                      "selling_price": 5000000000,
                      "furnishing": "Fully Furnished",
                      "size": 200,
                      "floor": "10",
                      "tower": "2",
                      "bedroom": 2,
                      "bathroom": 2,
                      "study_room": 1,
                      "price_currency": "Rupiah",
                      "remarks_1": "Unreachable",
                      "remarks_2": "Plumbing issue",
                      "remarks_3": "TBA",
                      "kode_propar": "AMP011",
                      "vat_percentage": 5,
                      "vat_is_included": true,
                      "wht_percentage": 2,
                      "wht_is_included": false,
                      "lease_term_time": 1,
                      "lease_term_type": "Year",
                      "property_area": {
                          "id": 1,
                          "region_name": "Pasar Senen"
                      },
                      "property_payment_term": {
                          "id": 1,
                          "payment_term": "Half in Advance"
                      },
                      "photos": [
                          {
                              "id": 1,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg"
                          },
                          {
                              "id": 2,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                          }
                      ],
                      "facilities": [
                          {
                              "id": 1,
                              "property_facility_name": {
                                  "id": 1,
                                  "facility_name": "Carpool"
                              }
                          },
                          {
                              "id": 2,
                              "property_facility_name": {
                                  "id": 2,
                                  "facility_name": "Bunker"
                              }
                          }
                      ]
                  },
                  {
                      "available": "Yes",
                      "vat_details": "5% VAT Included within Price",
                      "wht_details": "2% WHT Excluded from Price",
                      "lease_term_details": "1 Year(s)",
                      "name": "Ampera Apartment 11",
                      "address": "Jl. Diponegoro, No. 10",
                      "rental_price": 500000000,
                      "selling_price": 5000000000,
                      "furnishing": "Fully Furnished",
                      "size": 200,
                      "floor": "10",
                      "tower": "2",
                      "bedroom": 2,
                      "bathroom": 2,
                      "study_room": 1,
                      "price_currency": "Rupiah",
                      "remarks_1": "Unreachable",
                      "remarks_2": "Plumbing issue",
                      "remarks_3": "TBA",
                      "kode_propar": "AMP011",
                      "vat_percentage": 5,
                      "vat_is_included": true,
                      "wht_percentage": 2,
                      "wht_is_included": false,
                      "lease_term_time": 1,
                      "lease_term_type": "Year",
                      "property_area": {
                          "id": 1,
                          "region_name": "Pasar Senen"
                      },
                      "property_payment_term": {
                          "id": 1,
                          "payment_term": "Half in Advance"
                      },
                      "photos": [
                          {
                              "id": 1,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg"
                          },
                          {
                              "id": 2,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                          }
                      ],
                      "facilities": [
                          {
                              "id": 1,
                              "property_facility_name": {
                                  "id": 1,
                                  "facility_name": "Carpool"
                              }
                          },
                          {
                              "id": 2,
                              "property_facility_name": {
                                  "id": 2,
                                  "facility_name": "Bunker"
                              }
                          }
                      ]
                  },
                  {
                      "available": "Yes",
                      "vat_details": "5% VAT Included within Price",
                      "wht_details": "2% WHT Excluded from Price",
                      "lease_term_details": "1 Year(s)",
                      "name": "Ampera Apartment 11",
                      "address": "Jl. Diponegoro, No. 10",
                      "rental_price": 500000000,
                      "selling_price": 5000000000,
                      "furnishing": "Fully Furnished",
                      "size": 200,
                      "floor": "10",
                      "tower": "2",
                      "bedroom": 2,
                      "bathroom": 2,
                      "study_room": 1,
                      "price_currency": "Rupiah",
                      "remarks_1": "Unreachable",
                      "remarks_2": "Plumbing issue",
                      "remarks_3": "TBA",
                      "kode_propar": "AMP011",
                      "vat_percentage": 5,
                      "vat_is_included": true,
                      "wht_percentage": 2,
                      "wht_is_included": false,
                      "lease_term_time": 1,
                      "lease_term_type": "Year",
                      "property_area": {
                          "id": 1,
                          "region_name": "Pasar Senen"
                      },
                      "property_payment_term": {
                          "id": 1,
                          "payment_term": "Half in Advance"
                      },
                      "facilities": [
                          {
                              "id": 1,
                              "property_facility_name": {
                                  "id": 1,
                                  "facility_name": "Carpool"
                              }
                          },
                          {
                              "id": 2,
                              "property_facility_name": {
                                  "id": 2,
                                  "facility_name": "Bunker"
                              }
                          }
                      ],
                      "photos": [
                          {
                              "id": 1,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_7JHxy2UO_400x400.jpg"
                          },
                          {
                              "id": 2,
                              "photo_path": "/home/nas11ai/npa-database/server/assets/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg",
                              "photo_url": "/static/apartment/AMP011/AMP011_2023-06-07-11-24-20_9d8f4bce4b716d573f83ee14ad4fb095.jpg"
                          }
                      ]
                  }
              ]
          },
          "meta": {
              "version": "1.0",
              "timestamp": "6/30/2023, 6:09:01 PM"
          }
      }
  ````

  - Error response:

    ```json
    {
      "code": 400,
      "status": "BAD_REQUEST",
      "errors": {
        "kode_propar": "kode_propar must be a string"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/26/2023, 6:43:56 PM"
      }
    }
    ```

# Analytics

## Get Property Analytics

- Description:
  - Berfungsi untuk mengembalikan data analytics dari `Apartment`, `Home`, `Land`, `Office` yang terdaftar di database
- ### URL
  - /analytics/properties
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "analytics",
        "attributes": {
          "total_properties": 7,
          "total_available_properties": 7,
          "total_unavailable_properties": 0,
          "total_apartments": 1,
          "total_homes": 4,
          "total_lands": 1,
          "total_offices": 1
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "6/30/2023, 7:53:09 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

## Get Logs Data

- Description:
  - Berfungsi untuk mengembalikan data log dari aktivitas user yang terdaftar di database
- ### URL
  - /logs/data
- ### Method
  - GET
- ### Request Body Example
  ```txt
  Empty Body Request
  ```
- ### Response

  - Expected output:

    ```json
    {
      "code": 200,
      "status": "OK",
      "data": {
        "type": "logs",
        "attributes": {
          "current_page": 1,
          "data_count_on_current_page": 25,
          "total_data_count": 32,
          "total_pages": 2,
          "records": [
            {
              "created_at": "2023-07-16T05:31:22.000Z",
              "status_code": 200,
              "message": "User root Logout",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:27:53.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:27:48.000Z",
              "status_code": 200,
              "message": "Create new User tes",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:26:34.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:26:30.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:25:34.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:24:13.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:24:13.000Z",
              "status_code": 500,
              "message": "Internal Server Error",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:23:10.000Z",
              "status_code": 500,
              "message": "Internal Server Error",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:23:10.000Z",
              "status_code": 200,
              "message": "Viewing Logs Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:22:57.000Z",
              "status_code": 200,
              "message": "User root Validating Refresh Token",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:22:46.000Z",
              "status_code": 200,
              "message": "User root Login",
              "username": "root"
            },
            {
              "created_at": "2023-07-16T05:19:05.000Z",
              "status_code": 500,
              "message": "Internal Server Error",
              "username": null
            },
            {
              "created_at": "2023-07-15T07:35:51.000Z",
              "status_code": 204,
              "message": "Update Apartment AMP001 Name",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:35:51.000Z",
              "status_code": 204,
              "message": "Update Apartment AMP001 data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:35:51.000Z",
              "status_code": 204,
              "message": "Insert new photo in Apartment AMP001 data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:35:06.000Z",
              "status_code": 200,
              "message": "Viewing Apartment Data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:34:11.000Z",
              "status_code": 201,
              "message": "Property Area Ancol is CREATED",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:34:11.000Z",
              "status_code": 204,
              "message": "Insert new photo in Apartment AMP001 data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:34:11.000Z",
              "status_code": 204,
              "message": "Update Apartment AMP001 data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:01:40.000Z",
              "status_code": 200,
              "message": "Viewing Property Facility Bunker data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:01:40.000Z",
              "status_code": 200,
              "message": "Viewing Property Area Pasar Senen data",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:01:40.000Z",
              "status_code": 201,
              "message": "Apartment AMP010 is CREATED",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:01:40.000Z",
              "status_code": 201,
              "message": "Apartment AMP010 Photos are CREATED",
              "username": "root"
            },
            {
              "created_at": "2023-07-15T07:01:40.000Z",
              "status_code": 200,
              "message": "Viewing Property Person In Charge Mbappe data",
              "username": "root"
            }
          ]
        }
      },
      "meta": {
        "version": "1.0",
        "timestamp": "7/16/2023, 1:31:34 PM"
      }
    }
    ```

  - Error response:

    ```json
    {
      "code": 401,
      "status": "UNAUTHORIZED",
      "errors": {
        "access_token": "access token is missing"
      },
      "meta": {
        "version": "1.0",
        "timestamp": "1/22/2023, 10:53:28 PM"
      }
    }
    ```

- ### Query Params List

  - #### Pagination

    - Size

      - Fungsi:
        - Untuk menentukan banyaknya data dalam 1 halaman
      - `Nama Query` `:` `Tipe Data`:

        ```ts
        size: number;
        ```

    - Page
      - Fungsi:
        - Untuk menentukan nomor halaman
      - `Nama Query` `:` `Tipe Data`:
        ```ts
        page: number;
        ```
