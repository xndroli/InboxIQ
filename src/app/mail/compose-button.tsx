'use client'

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Pencil } from "lucide-react";
import React from "react"  
import EmailEditor from "./email-editor";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { toast } from "sonner";

const ComposeButton = () => {
    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>([])
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>([])

    const [subject, setSubject] = React.useState<string>('')

    const sendEmail = api.account.sendEmail.useMutation()
    const {account} = useThreads()

    const handleSend = async (value: string) => {
        if (!account) return 
        sendEmail.mutate({
            accountId: account.id,
            threadId: undefined,
            body: value,
            from: {name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com" },
            to: toValues.map(to => ({ name: to.value, address: to.value })),
            cc: ccValues.map(cc => ({ name: cc.value, address: cc.value })),
            replyTo: { name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com" },
            subject: subject,
            inReplyTo: undefined
        }, {
            onSuccess: () => {
                toast.success('Email sent!')
            },
            onError: (error) => {
                console.log(error)
                toast.error('Failed to send email')
            }
        })
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button>
                    <Pencil className="size-4 mr-1" />
                    Compose
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Compose Email</DrawerTitle>
                </DrawerHeader>
                <EmailEditor 
                    toValues={toValues}
                    setToValues={setToValues}
                    ccValues={ccValues}
                    setCcValues={setCcValues}
                    subject={subject}
                    setSubject={setSubject}

                    to={toValues.map(to => to.value)}
                    defaultToolbarExpanded={true}

                    handleSend={handleSend}
                    isSending={sendEmail.isPending}
                />
            </DrawerContent>
        </Drawer>
    )
};

export default ComposeButton;