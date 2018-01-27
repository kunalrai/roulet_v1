﻿using Newtonsoft.Json;

namespace JWT
{
    /// <summary>
    /// JSON Serializer using JavaScriptSerializer
    /// </summary>
    public class DefaultJsonSerializer : IJsonSerializer
    {
        /// <summary>
        /// Serialize an object to JSON string
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>JSON string</returns>
        public string Serialize(object obj)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(obj, new JsonSerializerSettings() {
                NullValueHandling = NullValueHandling.Ignore
            });
        }

        /// <summary>
        /// Deserialize a JSON string to typed object.
        /// </summary>
        /// <typeparam name="T">type of object</typeparam>
        /// <param name="json">JSON string</param>
        /// <returns>typed object</returns>
        public T Deserialize<T>(string json)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(json, new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Ignore
            });
        }
    }
}