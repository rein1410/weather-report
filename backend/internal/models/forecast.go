package models

import (
	"gorm.io/datatypes"
)

type Forecast struct {
	Dt       int64          `json:"dt" gorm:"primaryKey;uniqueIndex:idx_dt"`
	Temp     float32        `json:"temp"`
	Pressure float32        `json:"pressure"`
	Humidity float32        `json:"humidity"`
	Clouds   uint32         `json:"clouds"`
	Raw      datatypes.JSON `json:"-"`
}
