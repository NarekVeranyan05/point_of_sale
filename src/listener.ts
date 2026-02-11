/**
 * Listener is the interface for all classes that conform the Listener pattern
 */
export default interface Listener {
    /**
     * receives a notification from the event source
     */
    notify(): void;
}