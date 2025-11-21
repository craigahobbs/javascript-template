// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/** @module lib/app */

import {decodeQueryString, jsonStringifySortKeys} from 'schema-markdown/lib/encode.js';
import {parseSchemaMarkdown} from 'schema-markdown/lib/parser.js';
import {renderElements} from 'element-model/lib/elementModel.js';
import {validateType} from 'schema-markdown/lib/schema.js';


// The application's hash parameter type model
const myPackageTypes = parseSchemaMarkdown(`\
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
`);


/**
 * The MyPackage application
 *
 * @property {Object} window - The web browser window object
 * @property {?Object} params - The validated hash parameters object
 */
export class MyPackage {
    /**
     * Create an application instance
     *
     * @param {Object} window - The web browser window object
     */
    constructor(window) {
        this.window = window;
        this.params = null;
    }


    /**
     * Run the application. This method calls render and subscribes to any hash parameter changes to
     * re-render on any hash parameter change.
     */
    run() {
        this.render();
        this.window.addEventListener('hashchange', () => this.render(), false);
    }


    /**
     * Render the application
     */
    render() {
        // Parse the hash parameters and render the application element model
        let result;
        let isError = false;
        try {
            // Validate hash parameters
            const paramsPrev = this.params;
            this.updateParams();

            // Skip the render if the page params haven't changed
            if (paramsPrev !== null && jsonStringifySortKeys(paramsPrev) === jsonStringifySortKeys(this.params)) {
                return;
            }
        } catch ({message}) {
            result = {
                'title': 'MyPackage',
                'elements': {'html': 'p', 'elem': {'text': `Error: ${message}`}}
            };
            isError = true;
        }

        // Call the application main and validate the result
        if (!isError) {
            result = this.main();
        }

        // Set the window title
        this.window.document.title = result.title;

        // Render the element model
        renderElements(this.window.document.body, result.elements);

        // If there is a URL hash ID, re-navigate to go there since it was just rendered. After the
        // first render, re-render is short-circuited by the unchanged hash param check above.
        if (!isError && getHashID(this.window.location.hash) !== null) {
            this.window.location.href = this.window.location.hash;
        }
    }


    /**
     * Parse and validate the hash parameters
     *
     * @param {?string} paramString - Optional parameter string for testing
     */
    updateParams(paramString = null) {
        // Clear, then validate the hash parameters (may throw)
        this.params = null;

        // Decode the params string
        const params = decodeQueryString(paramString !== null ? paramString : this.window.location.hash.slice(1));

        // Validate the params
        this.params = validateType(myPackageTypes, 'MyPackage', params);
    }


    /**
     * The MyPackage application main entry point
     *
     * @returns {Object}
     */
    main() {
        // Help?
        if ('help' in this.params) {
            return {
                'title': 'Help',
                'elements': {'html': 'p', 'elem': {'text': 'Help'}}
            };
        }

        return {
            'title': 'Hello',
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        };
    }
}


// Get a URL's hash ID
export function getHashID(url) {
    const matchId = url.match(rHashId);
    return matchId !== null ? matchId[1] : null;
}

const rHashId = /[#&]([^=]+)$/;
