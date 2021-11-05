

protoc-gen:
	protoc \
		--plugin=node_modules/ts-proto/protoc-gen-ts_proto \
		--ts_proto_out=. src/protos/*.proto \
		--ts_proto_opt=esModuleInterop=true \
		--ts_proto_opt=env=node \
		--ts_proto_opt=nestJs=true \
		--ts_proto_opt=emitImportedFiles=false \
		--ts_proto_opt=useDate=true

test-debug:
	node \
		--inspect-brk \
		-r tsconfig-paths/register \
		-r ts-node/register node_modules/.bin/jest \
		--runInBand