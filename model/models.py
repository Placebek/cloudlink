from sqlalchemy import (
    String, 
    Integer, 
    Text, 
    Column, 
    Float,
    Date, 
    ForeignKey, 
    Boolean, 
    DECIMAL, 
    Enum as SAEnum,
    Time,
    UniqueConstraint,
    BigInteger,
    DateTime,
    func,
)
from sqlalchemy.orm import relationship
from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(Text, nullable=False)


class RaspberryDevice(Base):
    __tablename__ = "raspberry_devices"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String(100), nullable=False)
    serial = Column(String(200), nullable=True)
    ip_address = Column(String(50), nullable=True)
    online = Column(Boolean, default=False)
    temperature = Column(Float, nullable=True)
    software_version = Column(String(50), nullable=True)
    free_space = Column(Float, nullable=True)
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    last_ping = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="OK")  

    logs = relationship("DeviceLog", back_populates="device", cascade="all, delete")
    temps = relationship("TemperatureHistory", back_populates="device", cascade="all, delete")
    commands = relationship("DeviceCommand", back_populates="device", cascade="all, delete")


class TemperatureHistory(Base):
    __tablename__ = "temperature_history"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("raspberry_devices.id"))
    temperature = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    device = relationship("RaspberryDevice", back_populates="temps")


class DeviceLog(Base):
    __tablename__ = "device_logs"

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, ForeignKey("raspberry_devices.id"))
    message = Column(Text, nullable=False)
    level = Column(String(20), default="INFO")  
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    device = relationship("RaspberryDevice", back_populates="logs")


class DeviceCommand(Base):
    __tablename__ = "device_commands"

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, ForeignKey("raspberry_devices.id"))
    command = Column(String(100), nullable=False)  
    payload = Column(Text, nullable=True)         
    status = Column(String(20), default="pending")  
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    executed_at = Column(DateTime(timezone=True), nullable=True)

    device = relationship("RaspberryDevice", back_populates="commands")