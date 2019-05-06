create table weather_Station (
    ID int not null AUTO_INCREMENT,
    date date not null,
    temperature int not null,
    humidity int not null,
    PRIMARY KEY (ID)
);