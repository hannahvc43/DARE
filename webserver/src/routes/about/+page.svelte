<script>
    import { Card } from "flowbite-svelte";
</script>

<div class="text-white py-16 px-6 max-w-6xl mx-auto space-y-10 mt-10">
    <div class="text-center space-y-4 max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
            How <span class="text-purple-400">DareLance</span> Works
        </h1>
    </div>
    <div class="text-purple-200 text-center text-sm">
        First, make sure your wallet is connected using the MetaMask extension.
    </div>
    <div class="grid md:grid-cols-2 gap-8">
        <Card
            class="max-w-xl max-h-xl flex flex-col justify-between items-start"
        >
            <div class="m-6">
                <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-purple-700 dark:text-white"
                >
                    For Freelancers
                </h5>
                <!-- (1) Text was generated with help of AI, see prompt down below-->
                <ol
                    class="space-y-4 text-gray-900 list-decimal list-inside text-sm"
                >
                    <li>
                        <strong class="text-black">Publish a Service:</strong> Navigate
                        to the Explore page and click "Create a service" to list
                        your offer.
                    </li>
                    <li>
                        <strong class="text-black"
                            >Track Hires & Instructions:</strong
                        >
                        Go to the Dashboard page to see when a client hires your
                        service, along with their specific instructions.
                    </li>
                    <li>
                        <strong class="text-black">Submit Deliverables:</strong>
                        Complete the project and submit your work via a direct link.
                    </li>
                    <li>
                        <strong class="text-black">Get Paid:</strong> Receive your
                        ETH automatically once the client approves your submission,
                        or claim payment if the client exceeds their review window.
                    </li>
                    <li>
                        <strong class="text-black">Maintain Deadlines:</strong> Ensure
                        you deliver on time, missing the project deadline will result
                        in a client refund.
                    </li>
                </ol>
            </div>
        </Card>

        <Card
            class="max-w-xl max-h-xl flex flex-col justify-between items-start"
        >
            <div class="m-6">
                <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-purple-700 dark:text-white"
                >
                    For Clients
                </h5>
                <ol
                    class="space-y-4 text-gray-900 list-decimal list-inside text-sm"
                >
                <!--(1)-->
                    <li>
                        <strong class="text-black">Explore Services:</strong> Go
                        to the Explore page, select a service you want, and click
                        Hire.
                    </li>
                    <li>
                        <strong class="text-black">Add instructions:</strong> Use
                        the prompt pop-up to provide custom requirements or instructions
                        for the freelancer.
                    </li>
                    <li>
                        <strong class="text-black">Review Submissions:</strong
                        >Go to the Dashboard to inspect deliverables submitted
                        by freelancers before releasing payment.
                    </li>
                    <li>
                        <strong class="text-black">Approve or Refund:</strong> Approve
                        completion to release ETH instantly, or claim a refund if
                        the deadline expires. Note that unapproved work will automatically
                        release funds to the freelancer after 7 days.
                    </li>
                </ol>
            </div>
        </Card>
    </div>
</div>

<!--
(1) Prompt:
"Transform this text into clear bullet points:
For freelancers
Go to explore. Click the Create a service button to offer a service. In your dashboard can be seen if the service has been hired by someone, alongside some instructions they have. Submit a link to your deliverable. The client has 7 days to approve this. Once it is approved, you will be automatically paid. If the client goes over the deadline you can request to be paid. If you miss your deadline, the client will be refunded and you won't be paid.

For clients
Go to explore and select a service that you want to hire, click hire. A pop-up will appear that allows you to give extra
instructions. Your money will now be safely locked until the completion of the service. If you go to the dashboard you can see the status of the job. Once there has been a submission, you can view this and click on approve. The job has now been completed and the freelancer will be paid. If they miss the submission deadline, you will be able to ask for a refund. If you do not approve of the product within seven days, the freelancer will be automatically paid."
-->
