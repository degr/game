package org.forweb.commandos.database;

import org.forweb.commandos.database.query.Condition;
import org.forweb.commandos.database.query.Order;

import java.util.List;

public class Filter {
    private List<Condition> conditions;
    private List<Order> orders;
    private Integer page;
    private Integer size;

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public List<Condition> getConditions() {
        return conditions;
    }

    public void setConditions(List<Condition> conditions) {
        this.conditions = conditions;
    }

}
