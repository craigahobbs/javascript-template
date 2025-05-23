# Licensed under the MIT License
# https://github.com/{{github}}/{{package}}/blob/main/LICENSE


# Download javascript-build
JAVASCRIPT_BUILD_DIR ?= ../javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
$$(shell [ -f $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) ] && cp $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) . || $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if command -v wget >/dev/null 2>&1; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/Makefile.base))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/jsdoc.json))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/eslint.config.js))

{%- if noapp is not defined or not noapp %}


# Set gh-pages source
GHPAGES_SRC := build/app/
{%- endif %}


# Include javascript-build
{%- if noapp is not defined or not noapp %}
USE_JSDOM := 1
{%- endif %}
include Makefile.base


clean:
	rm -rf Makefile.base jsdoc.json eslint.config.js

{%- if noapp is not defined or not noapp %}


help:
	@echo '            [app|run|'


.PHONY: app run
run: app
	python3 -m http.server --directory build/app


commit: app
app: build/npm.build
	rm -rf build/app/
	mkdir -p build/app/

    # Copy dependencies
	cp -R \
		static/* \
		lib \
		node_modules/element-model \
		node_modules/markdown-model \
		node_modules/schema-markdown \
		node_modules/schema-markdown-doc \
		build/app/

    # Fix imports
	for FILE in `find build/app/*/lib -name '*.js'`; do \
		sed -E "s/from '([^\.])/from '..\/..\/\1/g" $$FILE > $$FILE.tmp && \
		mv $$FILE.tmp $$FILE; \
	done
	for FILE in `find build/app/* -name '*.js'`; do \
		sed -E "s/from '([^\.])/from '..\/\1/g" $$FILE > $$FILE.tmp && \
		mv $$FILE.tmp $$FILE; \
	done
{%- endif %}
