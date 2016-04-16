cd api/ &&
export port="3110" &&

export log_level="debug"  &&
export log_path="./node_crud-log.log"  &&

export security_password_salt=""  &&
export security_session_secret="123"  &&

export mongo_db_host="ds037205.mongolab.com"  &&
export mongo_db_port="37205"  &&
export mongo_db_db_name="node_crud"  &&
export mongo_db_username="node_crud"  &&
export mongo_db_password="htcevo3d"  &&

export frontend_host="http://localhost:3333"  &&
export backend_host="http://localhost:3110"  &&

echo "port : " $port && 
echo "mongo_db_host :" $mongo_db_host && 
echo "mongo_db_port :" $mongo_db_port &&
echo "mongo_db_db_name :" $mongo_db_db_name &&
echo "mongo_db_username :" $mongo_db_username &&
echo "frontend_host :" $frontend_host &&
echo "backend_host :" $backend_host &&

node app.js
