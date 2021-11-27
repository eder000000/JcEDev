export function concatJSON(json1, json2)
{
    for (var key in json2) 
    {
        json1[key] = json2[key];
    }

    return json1;
}