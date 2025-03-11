run-server:
	@echo "Starting server"
	cd goserver && go run main.go
run-game:
	cd game && yarn dev
run:
	@$(MAKE) -j2 run-server run-game