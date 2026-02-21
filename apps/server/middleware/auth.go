package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/MicahParks/keyfunc/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Context key for the authenticated user ID (set after JWT validation).
const ContextKeyUserID = "user_id"

// jwks caches the Supabase Auth public keys so we don't fetch them on every request.
var jwks *keyfunc.JWKS

// InitJWKS must be called at server startup. It fetches the JWKS from Supabase Auth.
// Requires SUPABASE_URL to be set (e.g. https://<project-ref>.supabase.co).
func InitJWKS() error {
	supabaseURL := strings.TrimSuffix(os.Getenv("SUPABASE_URL"), "/")
	if supabaseURL == "" {
		return fmt.Errorf("SUPABASE_URL is not set")
	}
	jwksURL := fmt.Sprintf("%s/auth/v1/.well-known/jwks.json", supabaseURL)
	var err error
	jwks, err = keyfunc.Get(jwksURL, keyfunc.Options{})
	return err
}

// SupabaseAuth validates the JWT using Supabase's JWKS (RS256). Call InitJWKS() before using this middleware.
func SupabaseAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if jwks == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT validation not initialized"})
			c.Abort()
			return
		}
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			c.Abort()
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token format"})
			c.Abort()
			return
		}
		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, jwks.Keyfunc)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}
		sub, _ := claims["sub"].(string)
		if sub == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}
		// Reject anonymous tokens; only "authenticated" role is allowed
		if role, _ := claims["role"].(string); role != "authenticated" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "insufficient permissions"})
			c.Abort()
			return
		}
		c.Set(ContextKeyUserID, sub)
		c.Next()
	}
}