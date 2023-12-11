#--------------------------------------------------------------------
from flask import Flask, request, jsonify

from flask_cors import CORS

import mysql.connector

import os

import time, datetime
#--------------------------------------------------------------------

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}) 

#--------------------------------------------------------------------

class Cliente:
    #constructor de la clase
    def __init__(self, host, user, password, database, port):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
        self.cursor = self.conn.cursor()

        try:
           self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
            
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS subscriptores (
            id int(11) NOT NULL AUTO_INCREMENT,
            nombre varchar(30) NOT NULL,
            apellido varchar(30) NOT NULL,
            telefono varchar(15) NOT NULL,
            email varchar(60) NOT NULL,
            combo int(11) NOT NULL,
            comentario text NOT NULL,
            fecha_solicitud datetime NOT NULL,
            leido tinyint(1) DEFAULT NULL,
            gestion text DEFAULT NULL,
            fecha_gestion datetime DEFAULT NULL,
            PRIMARY KEY(`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
            ''')
        
        self.conn.commit() #confirma la creacion de la BD
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        
    #----------------------------------------------------------------
    def enviar_datos_cliente(self, nombre, apellido, telefono, email, combo, comentario):
        sql = "INSERT INTO subscriptores(nombre, apellido, telefono, email, combo, comentario, fecha_solicitud) VALUES (%s, %s, %s, %s, %s, %s)"
        fecha_solicitud = datetime.datetime.now()
        valores = (nombre, apellido, telefono, email, combo, comentario, fecha_solicitud)
        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return True

    #----------------------------------------------------------------
    def listar_clientes(self):
        self.cursor.execute("SELECT * FROM subscriptores")
        subscriptores = self.cursor.fetchall()
        return subscriptores

    #----------------------------------------------------------------
    def gestion_comentario(self, id, gestion):
        fecha_gestion = datetime.datetime.now()
        sql = "UPDATE subscriptores SET leido = 1, gestion = %s, fecha_gestion = %s WHERE id = %s"
        valores = (gestion, fecha_gestion, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0 #se retorna un valor true o false, si el rowcount es 0 porque no se realizo ninguna modificacion, es false. Si se modifico, hubo cambios en una fila(row) y sera 1>0, true

    #----------------------------------------------------------------
    def mostrar_cliente(self, id):
         sql = f"SELECT id, nombre, apellido, telefono, email, combo, comentario, fecha_solicitud, leido, gestion, fecha_gestion FROM subscriptores WHERE id = {id}"
         self.cursor.execute(sql)
         return self.cursor.fetchone()

    #----------------------------------------------------------------
    def eliminar_cliente(self, id):
        self.cursor.execute(f"DELETE FROM subscriptores WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0


# Creamos el objeto
cliente = Cliente("localhost","root","","subscripciones","3307")

#--------------------------------------------------------------------
@app.route("/subscripcion", methods=["GET"])
def listar_clientes():
    respuesta = cliente.listar_clientes()
    return jsonify(respuesta)


#--------------------------------------------------------------------
@app.route("/subscripcion", methods=["POST"])
def enviar_datos_cliente():
    #Recojo los datos del form
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    telefono = request.form['telefono']
    email = request.form['email']
    combo = request.form['combo']
    comentario = request.form['comentario']  

    if cliente.enviar_datos_cliente(nombre, apellido, telefono, email, combo, comentario):
        return jsonify({"mensaje": "Subscripción exitosa"}), 201
    else:
        return jsonify({"mensaje": "No fue posible registrar la subscripción"}), 400
  

#--------------------------------------------------------------------
@app.route("/subscripcion/<int:id>", methods=["PUT"])
def definir_gestion(id):
    #Recojo los datos del form
    gestion = request.form.get("gestion")
    
    if cliente.gestion_comentario(id, gestion):
        return jsonify({"mensaje": "Gestión registrada exitosamente"}), 200
    else:
        return jsonify({"mensaje": "No fue posible registrar la gestión "}), 403


#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)