package org.forweb.commandos.database;

import java.util.HashMap;

public class Row extends HashMap<String, String> {
    public Row(int columns) {
        super(columns);
    }

    public Integer getInt(String key) {
        String out = get(key);
        return out != null ? Integer.parseInt(out) : null;
    }
}
