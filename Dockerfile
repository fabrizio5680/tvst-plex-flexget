FROM smulhall/tvflex:v1

COPY . /

RUN npm install

RUN chmod +x /entry.sh

EXPOSE 34700

ENTRYPOINT ["/entry.sh"]
