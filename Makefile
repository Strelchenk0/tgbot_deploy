.PHONY: run stop im

run:
	docker run -d -v bot:/app --rm --name tgbot tgbot:latest

stop:
	docker stop tgbot

im:
	docker images

