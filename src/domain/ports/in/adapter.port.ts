export interface InboundAdapter {
    /**
     * Starts the adapter.
     *
     * Inbound adapters boot the application and keep it running until it exits.
     */
    start(): void;
}
