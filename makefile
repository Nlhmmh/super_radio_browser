help:
	@echo "make [command]"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'

run:
	npm start

i: ## yarn ios
	npm run ios

a: ## yarn android
	npm run android

w: ## yarn android
	npm run web

a-build-expo:
	eas build -p android --profile production

a-build-local:
	eas build -p android --local
