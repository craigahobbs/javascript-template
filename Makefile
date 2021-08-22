# Licensed under the MIT License
# https://github.com/craigahobbs/javascript-template/blob/main/LICENSE


.PHONY: help
help:
	@echo 'usage: make [changelog|clean|commit|superclean|test]'


.PHONY: commit
commit: test


.PHONY: clean
clean:
	rm -rf build/ test-actual/


.PHONY: superclean
superclean: clean


# Test rule function - name, template args
define TEST_RULE
test: test-$(strip $(1))

.PHONY: test-$(strip $(1))
test-$(strip $(1)): build/venv.build
	rm -rf test-actual/test-$(strip $(1))/
	build/venv/bin/template-specialize template/ test-actual/test-$(strip $(1))/ $(strip $(2))
	diff -r test-actual/test-$(strip $(1))/ test-expected/test-$(strip $(1))/
	$$(MAKE) -C test-actual/test-$(strip $(1))/ commit
	rm -rf test-actual/test-$(strip $(1))/
endef


# Test rules
.PHONY: test
test:
	rm -rf test-actual/

$(eval $(call TEST_RULE, required, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe'))

$(eval $(call TEST_RULE, noapp, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe' -k noapp 1))

$(eval $(call TEST_RULE, noapp-0, \
    -k package 'my-package' -k name 'John Doe' -k email 'johndoe@gmail.com' -k github 'johndoe' -k noapp 0))


.PHONY: changelog
changelog: build/venv.build
	build/venv/bin/simple-git-changelog


build/venv.build:
	python3 -m venv build/venv
	build/venv/bin/pip -q install --progress-bar off -U pip setuptools wheel
	build/venv/bin/pip -q install --progress-bar off simple-git-changelog template-specialize
	touch $@
