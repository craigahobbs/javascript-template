# {{package}}

[![npm](https://img.shields.io/npm/v/{{package}})](https://www.npmjs.com/package/{{package}})
[![GitHub](https://img.shields.io/github/license/{{github}}/{{package}})](https://github.com/{{github}}/{{package}}/blob/main/LICENSE)

{% if noapp is defined and noapp -%}
[{{package}} API Documentation](https://{{github}}.github.io/{{package}}/)
{%- else -%}
[{{package}} Application](https://{{github}}.github.io/{{package}}/)
{%- endif %}

Coming soon!


## Development

{{package}} is developed using [javascript-build](https://github.com/craigahobbs/javascript-build#readme)
and it was started using [javascript-template](https://github.com/craigahobbs/javascript-template#readme):

```
template-specialize javascript-template/template/ {{package}}/ -k package {{package}} -k name '{{name}}' -k email '{{email}}' -k github '{{github}}'{% if noapp is defined and noapp %} -k noapp 1{% endif %}
```
