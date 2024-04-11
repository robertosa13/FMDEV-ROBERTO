FROM openjdk:8-jdk-slim

ENV SHARED_FOLDER="user_data"

# variáveis adicionadas a partir do stackoverflow
# https://stackoverflow.com/questions/48129029/hdfs-namenode-user-hdfs-datanode-user-hdfs-secondarynamenode-user-not-defined
ENV HDFS_NAMENODE_USER="root"
ENV HDFS_DATANODE_USER="root"
ENV HDFS_SECONDARYNAMENODE_USER="root"
ENV YARN_RESOURCEMANAGER_USER="root"
ENV YARN_NODEMANAGER_USER="root"
ENV YARN_HOME=$HADOOP_HOME

# Variaveis de ambiente do Hadoop
#ENV HADOOP_VERSION 3.3.3
ENV HADOOP_VERSION 3.3.3
ENV HADOOP_MINOR_VERSION 3
ENV HADOOP_HOME /usr/hadoop-$HADOOP_VERSION
ENV HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
ENV STREAM_JAR=$HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-3.3.3.jar

# Variaveis de ambiente do Scala
ENV SCALA_VERSION 2.12.19
ENV SCALA_HOME=/usr/scala
ENV PATH=$PATH:$SCALA_HOME/bin

# Variaveis de ambiente do Spark
ENV SPARK_VERSION 3.3.0
#ENV SPARK_VERSION 3.5.1
ENV SPARK_HOME /usr/spark-${SPARK_VERSION}
ENV SPARK_CONF_DIR=$SPARK_HOME/conf
ENV SPARK_MASTER_HOST=master
ENV SPARK_DIST_CLASSPATH="$HADOOP_HOME/etc/hadoop/*:$HADOOP_HOME/share/hadoop/common/lib/*:$HADOOP_HOME/share/hadoop/common/*:$HADOOP_HOME/share/hadoop/hdfs/*:$HADOOP_HOME/share/hadoop/hdfs/lib/*:$HADOOP_HOME/share/hadoop/hdfs/*:$HADOOP_HOME/share/hadoop/yarn/lib/*:$HADOOP_HOME/share/hadoop/yarn/*:$HADOOP_HOME/share/hadoop/mapreduce/lib/*:$HADOOP_HOME/share/hadoop/mapreduce/*:$HADOOP_HOME/share/hadoop/tools/lib/*"

# Configuracoes do pyspark
ENV PYSPARK_PYTHON python3

# Usar python3 para modo cluster, e jupyter + configuracao de PYSPARK_DRIVER_PYTHON_OPTS='notebook'
# para modo interativo
ENV PYSPARK_DRIVER_PYTHON=python3
#ENV PYSPARK_DRIVER_PYTHON=jupyter
#ENV PYSPARK_DRIVER_PYTHON_OPTS='notebook'

# Adicao de valores aos paths abaixo para que os componentes os localizem
ENV PYTHONPATH $SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.7-src.zip:/usr/bin/python3
ENV PATH $PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$SPARK_HOME/bin:$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.7-src.zip:$PYTHONPATH:$HIVE_HOME/bin:$KAFKA_HOME/bin:$SCALA_HOME/bin

#COPY /config/jupyter/requirements.txt /

# Instalando pacotes básicos e pré-requisitos
RUN apt-get update \
    && apt-get install -y wget net-tools htop lsof nano ssh openssh-server curl iputils-ping \
    python3 python3-pip python3-dev python-is-python3 \
    build-essential libssl-dev libffi-dev libpq-dev

# Instalando JupyterLab e outras dependências Python
# RUN pip install jupyterlab notebook \
#     && python3 -m pip install -r requirements.txt \
#     && python3 -m pip install dask[bag] --upgrade \
#     && python3 -m pip install --upgrade toree \
#     && python3 -m bash_kernel.install

# Scala
RUN  wget https://downloads.lightbend.com/scala/${SCALA_VERSION}/scala-${SCALA_VERSION}.tgz 
   
RUN tar -zvxf scala-${SCALA_VERSION}.tgz \
    && rm scala-${SCALA_VERSION}.tgz \
    && mv /scala-${SCALA_VERSION} /usr/scala \
    && rm -rf /usr/scala/doc \
    # Configurando o JAVA_HOME para os processos localizarem a instalação do Java
    && echo "export JAVA_HOME=${JAVA_HOME}" >> /etc/environment


# Instalando Hadoop
#https://dlcdn.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz
#
RUN wget https://archive.apache.org/dist/hadoop/common/hadoop-3.3.3/hadoop-3.3.3.tar.gz \
    && tar zvxf hadoop-${HADOOP_VERSION}.tar.gz -C /usr/ \
    && rm hadoop-${HADOOP_VERSION}.tar.gz \
    && rm -rf ${HADOOP_HOME}/share/doc \
    && chown -R root:root ${HADOOP_HOME}

# Instalando Spark
#https://dlcdn.apache.org/spark/spark-3.5.1/spark-3.5.1-bin-hadoop3.tgz
#https://ftp.cc.uoc.gr/mirrors/apache/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop${HADOOP_MINOR_VERSION}.tgz


RUN wget https://archive.apache.org/dist/spark/spark-3.3.0/spark-3.3.0-bin-hadoop3.tgz \
    && tar zvxf spark-3.3.0-bin-hadoop3.tgz -C /tmp/ \
    && mv /tmp/spark* $SPARK_HOME \
    && rm spark-3.3.0-bin-hadoop3.tgz  \
    && chown -R root:root ${SPARK_HOME}

# Instalando Scala

# Scala
  
RUN wget https://downloads.lightbend.com/scala/${SCALA_VERSION}/scala-${SCALA_VERSION}.tgz \
    && tar -zvxf scala-${SCALA_VERSION}.tgz \
    && rm scala-${SCALA_VERSION}.tgz \
    && mv /scala-${SCALA_VERSION} /usr/scala \
    && rm -rf /usr/scala/doc \
    # Configurando o JAVA_HOME para os processos localizarem a instalação do Java
    && echo "export JAVA_HOME=${JAVA_HOME}" >> /etc/environment


#h2o
RUN apt install unzip

RUN wget --no-check-certificate http://h2o-release.s3.amazonaws.com/h2o/rel-3.46.0/1/h2o-3.46.0.1.zip \
    && unzip h2o-3.46.0.1.zip\
    && rm h2o-3.46.0.1.zip \
    && cd h2o-3.46.0.1\
    && wget -O flatfile.txt --no-check-certificate -r 'https://drive.google.com/uc?export=download&id=1R1xPaY8OC3aVdK-ojZoFMV5EEAG9LgaG' \
    && cd ~
    
    
RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa && \
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
    chmod 600 ~/.ssh/authorized_keys
COPY /config/config /root/.ssh
RUN chmod 600 /root/.ssh/config

# Todos os arquivos de configuracao que devem ser copiados para dentro do
# container estao aqui
COPY config/spark ${SPARK_HOME}/conf/
COPY workers ${SPARK_HOME}/conf/
COPY config/hadoop/*.xml /usr/hadoop-${HADOOP_VERSION}/etc/hadoop/
COPY workers /usr/hadoop-${HADOOP_VERSION}/etc/hadoop/
COPY config/scripts /
# COPY config/zookeeper ${ZOOKEEPER_HOME}/conf/

# Portas 10000:10002 relativas ao Hiveserver2
# Portas 2181 2888 e 3888 relativas ao Zookeper, 9092 ao Kafka, 9999 webui do Hiveserver
EXPOSE 9000 4040 8020 22 9083 8020 10000 10001 10002 2181 2888 3888 9092 9999 54321 54322 54323 54324

# Algumas configuracoes adicionais e inicio de alguns servicoes que devem ser feitos em
# tempo de execucao estao presentes no script bootstrap.
# Este cuidará de colocar alguns datasets exemplo dentro do HDFS, bem como de iniciar 
# servicos como HDFS (formatando Namenode), iniciando o Hive, definindo o ID do 
#  para que suas diferentes instâncias possam se ver e iniciando este servico.
# O comando ENTRYPOINT define que este script será executado quando os containeres
# iniciarem.
ENTRYPOINT ["/bin/bash", "bootstrap.sh"]
