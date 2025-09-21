services:
    postgres:
        image: postgres
        restart: unless-stopped
        ports:
            -5432:5432
        environment:
            POSTGRES_HOST_AUTH_METHOD: trust
        deploy:
            resources:
                limits:
                    cpus:'0.25'
                    memory: 512M
                    reservations:
                        memory: 256M
                        