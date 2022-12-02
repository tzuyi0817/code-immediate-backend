# code-immediate-backend

This is an api of the code immediate backend, the database uses MonogoDB.

## Features

- RESTful routing
- Models with proper relationships
- Controllers/Models etc with proper separation of concerns
- JWT Authentication
- RESTful errors

## Routes List:

### User

| Method     | URI                               | Action                                                  |
|------------|-----------------------------------|---------------------------------------------------------|
| `POST`     | `api/login`                       | `controllers\userController@login`                      |
| `GET`      | `api/github`                      | `auth redirect`                                         |
| `GET`      | `api/github/callback`             | `controllers\userController@github`                     |
| `POST`     | `api/register`                    | `controllers\userController@register`                   |
| `POST`     | `api/logout`                      | `controllers\userController@logout`                     |

### Code

| Method     | URI                               | Action                                                  |
|------------|-----------------------------------|---------------------------------------------------------|
| `GET`      | `api/code`                        | `controllers\codeController@getCodeList`                |
| `POST`     | `api/code`                        | `controllers\codeController@postCode`                   |
| `GET`      | `api/code/{id}`                   | `controllers\codeController@getCode`                    |
| `PUT`      | `api/code/{id}`                   | `controllers\codeController@updateCode`                 |
| `DELETE`   | `api/code/{id}`                   | `controllers\codeController@deleteCode`                 |
