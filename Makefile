.PHONY: default build clean docs git-hook pretty lint test run install

default: build

build: injectable userscript output

clean:
	rm --force --recursive _site node_modules output tsconfig.tsbuildinfo

docs:
	@echo "This project has no documentation."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

pretty: node_modules/.package-lock.json
	npm exec -- biome check --write --no-errors-on-unmatched
	npm exec -- stylelint --fix source/**.{css,scss} || true
	npm pkg fix

lint: node_modules/.package-lock.json
	npm exec -- biome check .
	npm exec -- stylelint source/**.{css,scss}
	npm exec -- tsc --noEmit

test:
	@echo "This project has no tests."

run: build
	node ./output/main.js


package-lock.json: package.json
	npm install --package-lock-only
node_modules/.package-lock.json: package-lock.json
	npm ci

icons: node_modules/.package-lock.json
	node contrib/convert-icons.js > source/_icons.scss

output: node_modules/.package-lock.json icons
	mkdir -p output
	node build.js > output/theme_neon.css
	MINIFY=true node build.js > output/theme_neon.min.css
	npm exec -- vite build --config source/colors/vite.config.js
	npm exec -- vite build --config source/icons/vite.config.js
	npm exec -- vite build --config source/science/vite.config.js

.PHONY: injectable
injectable: node_modules/.package-lock.json output
	npm exec -- vite --config vite.config.inject.js build
	MINIFY=true npm exec -- vite --config vite.config.inject.js build

.PHONY: userscript
userscript: node_modules/.package-lock.json output
	npm exec -- vite --config vite.config.user.js build
	MINIFY=true npm exec -- vite --config vite.config.user.js build

install:
	cp output/theme_neon.css ~/projects/kitten-science/kitten-scientists/devcontainer/res/theme_sleek.css
