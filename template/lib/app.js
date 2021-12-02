{% set packageClass = package.replace('-', ' ').title().replace(' ', '') %}
{%- set packageLocal = package[:1] + package.replace('-', ' ').title().replace(' ', '')[1:] -%}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/** @module lib/app */

import {ElementApplication} from 'element-app/lib/app.js';
import {UserTypeElements} from 'schema-markdown-doc/lib/userTypeElements.js';


// The application's hash parameter type model
const {{packageLocal}}HashTypes = `\
#
# This is the {{package}} application:
#
# [{{package}}](https://github.com/{{github}}/{{package}}#readme)
#
# ## Hash Parameters
#
# The {{package}} application recognizes the following hash parameters:
#
struct {{packageClass}}

    # Display the application's hash parameter documentation
    optional int(== 1) help
`;


/**
 * The {{packageClass}} application. The {{packageClass}} class extends the element-app
 * [ElementApplication]{@link https://craigahobbs.github.io/element-app/module-lib_app.ElementApplication.html}
 * class.
 *
 * @extends ElementApplication
 */
export class {{packageClass}} extends ElementApplication {
    /**
     * Create an application instance
     *
     * @param {Object} window - The web browser window object
     */
    constructor(window) {
        super(window, '{{package}}', '{{packageClass}}', {{packageLocal}}HashTypes);
    }

    /**
     * The [Element Application main entry point]{@link
     * https://craigahobbs.github.io/element-app/module-lib_app.ElementApplication.html#main}.
     *
     * @override
     * @returns {Object} [MainResult]{@link https://craigahobbs.github.io/element-app/module-lib_app.html#~MainResult}
     */
    main() {
        // Help?
        if ('help' in this.params) {
            return {
                'elements': new UserTypeElements(this.params).getElements(this.hashTypes, this.hashType)
            };
        }

        return {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        };
    }
}
