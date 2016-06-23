package org.forweb.commandos.response;

public enum Status {
    alive(1), shooted(2), fried(3), exploded(4), cutted(5), stats(6);

    private int status;
    private Status(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return String.valueOf(status);
    }
}
