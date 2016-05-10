package org.forweb.commandos.database;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class Db {
    private Connection connection;
    private static String url;
    private static String user;
    private static String password;

    private static Map<Thread, Connection> connectionPool = new HashMap<>();

    public static void init(String host, String user, String password, String database) {
        Db.url = "jdbc:mysql://" + host + "/" + database;
        Db.user = user;
        Db.password = password;
        try {
            //Register JDBC driver
            Class.forName("com.mysql.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public Db() {

    }

    private Connection getConnection(){
        if(this.connection == null) {
            if(connectionPool.containsKey(Thread.currentThread())) {
                this.connection = connectionPool.get(Thread.currentThread());
            } else {
                try {
                    connection = DriverManager.getConnection(url, user, password);
                    connection.setAutoCommit(true);
                } catch (SQLException e) {
                    e.printStackTrace();
                    this.connection = null;
                }
                connectionPool.put(Thread.currentThread(), this.connection);
            }
        }
        return this.connection;
    }

    public Table getTable(String query, Object... args) {


        Table out = new Table();
        try {
            ResultSet rs = getResultSet(query, args);
            ResultSetMetaData md = rs.getMetaData();
            int columns = md.getColumnCount();
            while (rs.next()) {
                Row row = new Row(columns);
                for (int i = 1; i <= columns; ++i) {
                    Object o = rs.getObject(i);
                    row.put(md.getColumnName(i), o != null ? o.toString() : null);
                }
                out.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return out;
    }

    public Row getRow(String query, Object... args) {
        Table out = getTable(query, args);
        if (out.size() > 0) {
            return out.get(0);
        } else {
            return null;
        }
    }

    public String getCell(String query, Object... args) {
        Row row = getRow(query, args);
        if (row != null) {
            return row.values().iterator().next();
        } else {
            return null;
        }
    }

    public Integer getCellInt(String query, Object... args) {
        String out = getCell(query, args);
        if (out == null) {
            return null;
        }
        try {
            return Integer.parseInt(out);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return null;
        }
    }

    private ResultSet getResultSet(String query, Object... args) {
        try {
            if (args != null) {
                PreparedStatement statement = getConnection().prepareStatement(query,
                        ResultSet.TYPE_SCROLL_INSENSITIVE,
                        ResultSet.CONCUR_READ_ONLY);
                for (int i = 0; i < args.length; i++) {
                    Object arg = args[i];
                    if (arg instanceof Integer) {
                        statement.setInt(i + 1, (Integer) arg);
                    } else if (arg instanceof Float) {
                        statement.setFloat(i + 1, (Float) arg);
                    } else if (arg instanceof Double) {
                        statement.setDouble(i + 1, (Double) arg);
                    } else {
                        statement.setString(i + 1, arg.toString());
                    }
                }
                return statement.executeQuery();
            } else {
                Statement statement = getConnection().createStatement(
                        ResultSet.TYPE_SCROLL_INSENSITIVE,
                        ResultSet.CONCUR_READ_ONLY);
                return statement.executeQuery(query);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }


    public void query(String query, Object... args) {
        try {
            if (args != null) {
                PreparedStatement statement = getConnection().prepareStatement(query);
                for (int i = 0; i < args.length; i++) {
                    statement.setString(i + 1, args[i].toString());
                }
                statement.execute();
            } else {
                Statement statement = getConnection().createStatement();
                statement.executeQuery(query);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
