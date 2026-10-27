import React from 'react'

import * as LucideIcon from "lucide-react"

// Helper to convert kebab-case (slack-custom) to PascalCase (SlackCustom)
const toPascalCase = (str: string) => 
    str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());
const DynamicIcon = ({iconName}:{iconName:string}) => {
    const pascalName = toPascalCase(iconName);

    const IconComponent = (LucideIcon as any)[pascalName]

    if (!IconComponent) {
        return <LucideIcon.HelpCircle className="w-5 h-5 text-gray-400" />;
    }  

    return <IconComponent className="w-10 h-10" />

}

export default DynamicIcon