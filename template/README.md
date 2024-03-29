# {{package}}

[![npm](https://img.shields.io/npm/v/{{package}})](https://www.npmjs.com/package/{{package}})
[![GitHub](https://img.shields.io/github/license/{{github}}/{{package}})](https://github.com/{{github}}/{{package}}/blob/main/LICENSE)

Coming soon!


## Links

{% if noapp is defined and noapp -%}
- [API Documentation](https://{{github}}.github.io/{{package}}/)
{%- else -%}
- [{{package}} Application](https://{{github}}.github.io/{{package}}/)
{%- endif %}
- [Source code](https://github.com/{{github}}/{{package}})


## Development

This package is developed using [javascript-build](https://github.com/craigahobbs/javascript-build#readme).
It was started using [javascript-template](https://github.com/craigahobbs/javascript-template#readme) as follows:

~~~
template-specialize javascript-template/template/ {{package}}/ -k package {{package}} -k name '{{name}}' -k email '{{email}}' -k github '{{github}}'{% if noapp is defined and noapp %} -k noapp 1{% endif %}
~~~
