// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/** @module lib/app */

import {ElementApplication} from 'element-app/lib/app.js';
import {encodeQueryString} from 'schema-markdown/lib/encode.js';
import {schemaMarkdownDoc} from 'schema-markdown-doc/lib/schemaMarkdownDoc.js';


// The application's hash parameter type model
const myPackageHashTypes = `\
#
# This is the my-package application:
#
# [my-package](https://github.com/johndoe/my-package#readme)
#
# ## Hash Parameters
#
# The my-package application recognizes the following hash parameters:
#
struct MyPackage

    # Display the application's hash parameter documentation
    optional int(== 1) help
`;


/**
 * The MyPackage application. The MyPackage class extends the element-app
 * [ElementApplication]{@link https://craigahobbs.github.io/element-app/module-lib_app.ElementApplication.html}
 * class.
 *
 * @extends ElementApplication
 */
export class MyPackage extends ElementApplication {
    /**
     * Create an application instance
     *
     * @param {Object} window - The web browser window object
     */
    constructor(window) {
        super(window, 'my-package', 'MyPackage', myPackageHashTypes);
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
                'elements': schemaMarkdownDoc(this.hashTypes, this.hashType, {'params': encodeQueryString(this.params)})
            };
        }

        return {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        };
    }
}
