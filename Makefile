# Licensed under the MIT License
# https://github.com/craigahobbs/javascript-app-template/blob/main/LICENSE


# Download Python Build's pylintrc (for unit test static analysis)
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell if which wget; then wget -q $(1); else curl -Os $(1); fi)
endif
endef
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/python-build/main/pylintrc))


PYLINT_VERSION ?= 2.9.*


.PHONY: help
help:
	@echo 'usage: make [changelog|clean|commit|lint|superclean|test]'


.PHONY: commit
commit: test lint


.PHONY: clean
clean:
	rm -rf __pycache__/ build/ test_actual/ pylintrc
	$(foreach DIR, $(wildcard test_expected/*),$(MAKE) -C $(DIR) clean &&) :


.PHONY: superclean
superclean: clean


.PHONY: test
test: build/venv.build
	python3 -m unittest -v $(if $(TEST),$(TEST),tests.py)
	rm -rf test_actual/


.PHONY: lint
lint: build/venv.build
	build/venv/bin/pylint tests.py


.PHONY: changelog
changelog: build/venv.build
	build/venv/bin/simple-git-changelog


build/venv.build:
	python3 -m venv build/venv
	build/venv/bin/pip --disable-pip-version-check --no-cache-dir install --progress-bar off -U pip setuptools wheel
	build/venv/bin/pip --disable-pip-version-check --no-cache-dir install --progress-bar off \
		pylint=="$(PYLINT_VERSION)" simple-git-changelog template-specialize
	touch $@
