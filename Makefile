# Licensed under the MIT License
# https://github.com/craigahobbs/javascript-template/blob/main/LICENSE


MAKEJ ?= -j


.PHONY: help
help:
	@echo 'usage: make [changelog|clean|commit|superclean|test]'


.PHONY: commit
commit: test


.PHONY: clean
clean:
	rm -rf build/ test-actual/


.PHONY: gh-pages
gh-pages:


.PHONY: superclean
superclean: clean


# Helper to edit files with sed
SED_FILE = if [ -f $(strip $(2)) ]; then sed -E $(strip $(1)) $(strip $(2)) >> $(strip $(2)).tmp && mv $(strip $(2)).tmp $(strip $(2)); fi


# Test rule function - name, template args
define TEST_RULE
test: test-$(strip $(1))

.PHONY: test-$(strip $(1))
test-$(strip $(1)): build/venv.build
	@echo 'Testing "$(strip $(1))"...'
	rm -rf test-actual/$(strip $(1))/
	build/venv/$$(VENV_BIN)/template-specialize template/ test-actual/$(strip $(1))/ $(strip $(2))
	$(call SED_FILE, 's/[0-9]{4}(,? John Doe)/YYYY\1/g', test-actual/$(strip $(1))/LICENSE)
	diff -r test-actual/$(strip $(1))/ test-expected/$(strip $(1))/
	JAVASCRIPT_BUILD_DIR=../../../javascript-build $$(MAKE) $(MAKEJ) -C test-actual/$(strip $(1))/ commit
	rm -rf test-actual/$(strip $(1))/
endef


# Test rules
.PHONY: test
test:
	rm -rf test-actual/
	@echo Tests completed - all passed

$(eval $(call TEST_RULE, required, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe'))

$(eval $(call TEST_RULE, noapp, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe' -k noapp 1))

$(eval $(call TEST_RULE, noapp-0, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe' -k noapp 0))


.PHONY: changelog
changelog: build/venv.build
	build/venv/$(VENV_BIN)/simple-git-changelog


build/venv.build:
	python3 -m venv --upgrade-deps build/venv
	build/venv/$(VENV_BIN)/pip -q install --progress-bar off simple-git-changelog template-specialize
	touch $@


# Windows support
VENV_BIN := bin
ifeq '$(OS)' 'Windows_NT'
ifeq ($(shell python3 -c "import sysconfig; print(sysconfig.get_preferred_scheme('user'))"),nt_user)
VENV_BIN := Scripts
endif
endif
