extern crate doc_index_updater;

mod support;
use doc_index_updater::{create_manager, service_bus_client::create_factory};
use support::get_ok;

#[test]
#[ignore]
fn create_manager_works() {
    let sent_message = "This is the create test message";
    let mut create_client = get_ok(create_factory());
    get_ok(create_client.send_event(sent_message, time::Duration::seconds(1)));

    let mut received_message = get_ok(create_manager::get_message(&mut create_client));
    while received_message != sent_message {
        received_message = get_ok(create_manager::get_message(&mut create_client));
    }

    assert_eq!(received_message, sent_message);
}
