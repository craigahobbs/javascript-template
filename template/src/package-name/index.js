// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

{% set packageFile = package[:1] + package.replace('-', ' ').title().replace(' ', '')[1:] + '.js' -%}
{% set packageClass = package.replace('-', ' ').title().replace(' ', '') -%}
{% if app is not defined or not app -%}
export {{'{'}}sumNumbers} from './{{packageFile}}';
{%- else -%}
export {{'{'}}{{packageClass}}} from './{{packageFile}}';
{%- endif %}
