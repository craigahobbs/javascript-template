# javascript-template

**javascript-template** is a JavaScript project template for use with
[template-specialize](https://pypi.org/project/template-specialize/).

- Creates a new JavaScript package project
  - Optional lightweight, client-rendered web application
- Development experience using [javascript-build](https://github.com/craigahobbs/javascript-build#readme)
- Run unit tests with [node --test](https://nodejs.org/api/test.html)
- Code coverage using [c8](https://www.npmjs.com/package/c8)
  - 100% code coverage enforced (configurable)
- Static code analysis using [eslint](https://www.npmjs.com/package/eslint)
- Package documentation using [jsdoc](https://www.npmjs.com/package/jsdoc)
- Publish the package to [npm](https://www.npmjs.com/)
- Publish application or documentation to [GitHub Pages](https://pages.github.com/)


## Create a New JavaScript Project

To create a new JavaScript project, clone this repository and render the template using
[template-specialize](https://pypi.org/project/template-specialize/). For example:

~~~
template-specialize javascript-template/template/ my-package/ \
    -k package "my-package" \
    -k name "John Doe" \
    -k email "johndoe@gmail.com" \
    -k github "johndoe"
~~~

The template defines the following template variables:

- **package** - the JavaScript package name (e.g., "my-package")

- **name** - the package author's full name (e.g., "John Doe")

- **email** - the package author's email address

- **github** - the package author's GitHub account name (e.g., "johndoe")

- **noapp** (optional) - if true, the web application is omitted


## Development Basics

Generated projects have a complete build/development experience using
[javascript-build](https://github.com/craigahobbs/javascript-build#readme).
It provides commands for running unit tests (with and without code coverage), running static code
analysis, building API documentation, publishing API documentation to GitHub Pages, creating and
updating a changelog file, and publishing the package to npm.

Here are a few basic commands to help you get started. For more detailed documentation, see the
[javascript-build documentation](https://github.com/craigahobbs/javascript-build#contents).

Before any commit, run the **make commit** command to run all tests:

~~~
make commit
~~~

To run unit tests, use the **make test** command:

~~~
make test
~~~

To run unit tests on a specific unit test, use the **TEST** argument:

~~~
make test TEST="test name"
~~~

To run unit tests with code coverage, use the **make cover** command:

~~~
make cover
~~~

To publish the application or API documentation to [GitHub Pages](https://pages.github.com/), use the **make gh-pages** command:

~~~
make gh-pages
~~~

To create or update a changelog file, use the **make changelog** command:

~~~
make changelog
~~~

Finally, to publish to [npm](https://www.npmjs.com/), use the **make publish** command:

~~~
make publish
~~~


## Project Structure

The project structure is as follows:

~~~
|-- LICENSE
|-- Makefile
|-- README.md
|-- package.json
|-- lib
|   `-- app.js
|-- test
|   `-- testApp.js
`-- static
    |-- app.css
    `-- index.html
~~~

For "noapp" projects the structure is:

~~~
|-- LICENSE
|-- Makefile
|-- README.md
|-- package.json
|-- lib
|   `-- packageName.js
`-- test
    `-- testPackageName.js
~~~
