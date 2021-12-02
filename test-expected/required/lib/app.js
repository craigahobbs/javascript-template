// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

import {ElementApplication} from 'element-app/lib/app.js';


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
     * https://craigahobbs.github.io/element-app/module-lib_app.ElementApplication.html#helpElements}.
     *
     * @override
     * @returns {Object} [MainResult]{@link https://craigahobbs.github.io/element-app/module-lib_app.html#~MainResult}
     */
    // eslint-disable-next-line require-await
    async main() {
        // Help?
        if ('help' in this.params) {
            return {
                'elements': this.helpElements()
            };
        }

        return {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        };
    }
}
