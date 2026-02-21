package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	sanbad "sanbad-api/middleware"
)

func main() {
	_ = godotenv.Load()
	if err := sanbad.InitJWKS(); err != nil {
		log.Fatalf("InitJWKS: %v", err)
	}

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Wednesday Badminton Group is Online! 🔥",
			"status":  "Live Reload Working",
		})
	})

	v1 := r.Group("/api/v1")
	v1.Use(sanbad.SupabaseAuth())
	{
		v1.GET("/me", func(c *gin.Context) {
			userID, _ := c.Get(sanbad.ContextKeyUserID)
			c.JSON(http.StatusOK, gin.H{"user_id": userID})
		})
	}

	r.Run(":8080")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:1412")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
