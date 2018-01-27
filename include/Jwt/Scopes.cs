using System;
using System.Collections.Generic;

public static class Scopes {
    public class Role {
        public string name { get; set; }
        public bool firewall { get; set; }
    }

    static Dictionary<string, Role> __roles__ = new Dictionary<string, Role>();

    static Scopes() {
        __roles__.Add("system", new Role() { name = "system", firewall = true });
        __roles__.Add("developer", new Role() { name = "developer", firewall = true });
        __roles__.Add("admin", new Role() { name = "admin", firewall = true });
        __roles__.Add("user", new Role() { name = "user" });
        __roles__.Add("disabled", new Role() { name = "disabled" });
    }
    public static string[] Parse(string scope) {
        if (string.IsNullOrWhiteSpace(scope)) {
            return new string[] { 
            };
        }
        string[] roles = scope.Split(new char[] {
                ',', ';', ' '
            }, StringSplitOptions.RemoveEmptyEntries);
        if (roles == null || roles.Length <= 0) {
            return new string[] {
            };
        }
        return roles;
    }
    public static bool IsScope(string scope) {
        string[] roles = Parse(scope);
        if (roles == null || roles.Length <= 0) {
            return false;
        }
        int count = 0;
        foreach (var role in roles) {
            if (string.IsNullOrWhiteSpace(role)) {
                continue;
            }
            if (!__roles__.ContainsKey(role)) {
                return false;
            }
            count++;
        }
        return count > 0;
    }
    public static Role IsRole(string role) {
        if (string.IsNullOrWhiteSpace(role)) {
            return null;
        }
        Role r;
        if (__roles__.TryGetValue(role, out r)) {
            return r;
        }
        return null;
    }
}