.PHONY: default build clean docs git-hook pretty lint test run install

default: build

build: output

clean:
	rm --force --recursive node_modules output tsconfig.tsbuildinfo

docs:
	@echo "This project has no documentation."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

pretty: node_modules
	yarn biome check --write --no-errors-on-unmatched
	yarn stylelint --fix source || true
	npm pkg fix

lint: node_modules
	yarn biome check .
	yarn stylelint source

test:
	@echo "This project has no tests."

run: build
	node ./output/main.js


node_modules:
	yarn install

icons: node_modules
	node contrib/convert-icons.js > source/_icons.scss

output: node_modules icons
	mkdir -p output
	node build.js > output/theme_neon.css

install:
	cp output/theme_neon.css ~/projects/kitten-science/kitten-scientists/devcontainer/res/theme_sleek.css
